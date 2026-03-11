import nodemailer from "nodemailer";
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { computeAllClusters, medicineEligibility } from "./clusterEngine";

const ensureBackendEnvLoaded = () => {
  const loadEnvFile = (process as any).loadEnvFile as undefined | ((file?: string) => void);
  if (typeof loadEnvFile !== "function") return;

  const hasMpesaCallbackConfig = Boolean(
    process.env.MPESA_CALLBACK_URL || process.env.MPESA_CALLBACK_URL_LOCAL || process.env.MPESA_CALLBACK_URL_FIREBASE,
  );
  if (hasMpesaCallbackConfig) return;

  const envCandidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "backend-server", ".env"),
    path.resolve(__dirname, "..", ".env"),
  ];

  for (const envPath of envCandidates) {
    if (!fs.existsSync(envPath)) continue;
    try {
      loadEnvFile(envPath);
    } catch {
      // Keep running; explicit env vars can still be provided by host runtime.
    }
    break;
  }
};

ensureBackendEnvLoaded();

const getEnv = (key: string, fallback = "") => String(process.env[key] || fallback).trim();
const isProduction = getEnv("NODE_ENV", "").toLowerCase() === "production";
const localLogLevel = getEnv("LOCAL_LOG_LEVEL", isProduction ? "warn" : "info").toLowerCase();
const keepAliveOnFatal = getEnv("LOCAL_KEEP_ALIVE_ON_FATAL", "true").toLowerCase() === "true";

const firstEnv = (...keys: string[]): string => {
  for (const key of keys) {
    const value = getEnv(key);
    if (value) return value;
  }
  return "";
};

const parseNumberEnv = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sessionsPath = firstEnv("REALTIME_SESSIONS_PATH", "VITE_REALTIME_SESSIONS_PATH") || "clusterSessions";
const courseCatalogPath = firstEnv("REALTIME_COURSES_PATH", "VITE_REALTIME_COURSES_PATH") || "courses";
const adminsPath = firstEnv("REALTIME_ADMINS_PATH", "VITE_REALTIME_ADMINS_PATH") || "admins";
const payableAmount = parseNumberEnv(getEnv("PAYABLE_AMOUNT"), 0);
const superAdminEmail = firstEnv("SUPER_ADMIN_EMAIL", "VITE_SUPER_ADMIN_EMAIL").toLowerCase();
const normalizeOrigin = (value: string) => String(value || "").trim().replace(/\/+$/, "");
const rawCorsOrigins = (firstEnv("CORS_ORIGIN", "LOCAL_CORS_ORIGIN", "FRONTEND_ORIGIN") || "*").trim() || "*";
const corsOrigins = rawCorsOrigins
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);
const allowAnyCorsOrigin = corsOrigins.includes("*");

const adminSessionCookieName = getEnv("ADMIN_SESSION_COOKIE_NAME", "admin_session");
const adminSessionTtlMs = Number(getEnv("ADMIN_SESSION_TTL_MS", `${24 * 60 * 60 * 1000}`)) || 24 * 60 * 60 * 1000;

type AdminProfile = {
  uid: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

type AdminSession = {
  id: string;
  uid: string;
  email: string;
  profile: AdminProfile;
  createdAt: string;
  expiresAt: string;
};

type ClusterSessionPayload = {
  code: string;
  email: string;
  phoneNumber: string;
  amountPaid: number;
  grades: Record<string, string>;
  results: Record<number, number>;
  medicineEligible: boolean;
  paymentResponse: any;
  createdAt: string;
  updatedAt: string;
  storage?: "firebase" | "local";
};

type NormalizedCourse = {
  name: string;
  requirements: Record<string, string>;
  universities: { name: string; cutoff: number; courseCode: string }[];
};

type NormalizedCatalog = Record<number, NormalizedCourse[]>;

type AdminRequest = express.Request & {
  adminSession?: AdminSession | null;
  requestId?: string;
};

// Simple console-based logger
const logger = {
  info: (message: string, payload?: any) => console.log(message, payload || ""),
  warn: (message: string, payload?: any) => console.warn(message, payload || ""),
  error: (message: string, payload?: any) => console.error(message, payload || ""),
  debug: (message: string, payload?: any) => console.debug(message, payload || ""),
};

// ---------- Firebase Realtime Database (REST) ----------

const getFirebaseDatabaseUrl = (): string => {
  const value = firstEnv("FIREBASE_DATABASE_URL", "VITE_FIREBASE_DATABASE_URL");
  if (!value) {
    throw new Error("FIREBASE_DATABASE_URL is not configured.");
  }
  return value.replace(/\/+$/, "");
};

const getFirebaseRealtimeDbAuthToken = (): string =>
  firstEnv("FIREBASE_DATABASE_AUTH_TOKEN", "FIREBASE_DATABASE_SECRET", "FIREBASE_LEGACY_TOKEN");

const normalizeRealtimePath = (value: string): string =>
  String(value || "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

const buildFirebaseRealtimeUrl = (dbPath = ""): string => {
  const normalizedPath = normalizeRealtimePath(dbPath);
  const base = getFirebaseDatabaseUrl();
  const pathname = normalizedPath ? `${normalizedPath}.json` : ".json";
  const url = new URL(`${base}/${pathname}`);
  const authToken = getFirebaseRealtimeDbAuthToken();
  if (authToken) {
    url.searchParams.set("auth", authToken);
  }
  return url.toString();
};

const firebaseRealtimeRequest = async ({
  method,
  dbPath = "",
  body,
}: {
  method: "GET" | "PUT" | "PATCH" | "DELETE";
  dbPath?: string;
  body?: any;
}) => {
  let response: Response;
  try {
    response = await fetch(buildFirebaseRealtimeUrl(dbPath), {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error: any) {
    throw new Error(`Firebase Realtime Database request failed: ${error?.message || "Network error."}`);
  }

  const payload: any = await response.json().catch(() => null);
  if (!response.ok) {
    const message = String(payload?.error || payload?.message || `Firebase Realtime Database error (${response.status}).`);
    const requestError: any = new Error(message);
    requestError.statusCode = response.status;
    throw requestError;
  }

  return payload;
};

class RealtimeSnapshot {
  private readonly valuePayload: any;

  constructor(payload: any) {
    this.valuePayload = payload;
  }

  exists() {
    return this.valuePayload !== null && this.valuePayload !== undefined;
  }

  val() {
    return this.valuePayload;
  }
}

class RealtimeDbRef {
  readonly path: string;

  constructor(dbPath = "") {
    this.path = normalizeRealtimePath(dbPath);
  }

  async once(eventType: "value") {
    if (eventType !== "value") {
      throw new Error("Only 'value' event type is supported.");
    }
    const payload = await firebaseRealtimeRequest({ method: "GET", dbPath: this.path });
    return new RealtimeSnapshot(payload);
  }

  async set(value: any) {
    await firebaseRealtimeRequest({ method: "PUT", dbPath: this.path, body: value });
  }

  async update(value: any) {
    await firebaseRealtimeRequest({ method: "PATCH", dbPath: this.path, body: value });
  }

  async remove() {
    await firebaseRealtimeRequest({ method: "DELETE", dbPath: this.path });
  }
}

const getRealtimeDb = () => ({
  ref: (dbPath = "") => new RealtimeDbRef(dbPath),
});

const safeErrorObject = (error: any) => ({
  name: error?.name || "Error",
  message: error?.message || "Unknown error.",
  code: error?.code || "",
  stack: error?.stack || "",
});

const logLocal = (level: "debug" | "info" | "warn" | "error", message: string, payload: any = {}) => {
  const levelOrder: Record<string, number> = { debug: 10, info: 20, warn: 30, error: 40 };
  const minLevel = levelOrder[localLogLevel] || levelOrder.info;
  const currentLevel = levelOrder[level] || levelOrder.info;
  if (currentLevel < minLevel) return;

  if (level === "debug") logger.debug(message, payload);
  else if (level === "warn") logger.warn(message, payload);
  else if (level === "error") logger.error(message, payload);
  else logger.info(message, payload);
};

const truncate = (value: unknown, maxLength = 160): string => {
  const text = String(value || "");
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

const summarizeBody = (body: any) => {
  if (!body || typeof body !== "object") return {};
  return {
    keys: Object.keys(body),
    amount: body.amount,
    phone: body["phone number"] || body.phone || body.phone_number || body.phoneNumber || "",
    email: body.email || "",
  };
};

const getRequestPath = (request: express.Request) =>
  (request.originalUrl as string) || request.url || request.path || "";

const ensureRequestId = (request: express.Request & { requestId?: string }) => {
  if (request.requestId) return String(request.requestId);
  const headerRequestId =
    (request.headers?.["x-request-id"] as string) || (request.headers?.["x-correlation-id"] as string) || "";
  const requestId = headerRequestId ? String(headerRequestId) : crypto.randomUUID();
  request.requestId = requestId;
  return requestId;
};

const adminSessionsById = new Map<string, AdminSession>();

const parseCookieHeader = (cookieHeader: string): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((accumulator, entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex <= 0) return accumulator;
      const key = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      if (!key) return accumulator;
      accumulator[key] = decodeURIComponent(value);
      return accumulator;
    }, {});
};

const clearExpiredAdminSessions = () => {
  const now = Date.now();
  for (const [sessionId, session] of adminSessionsById.entries()) {
    const expiresAt = Date.parse(session.expiresAt) || 0;
    if (expiresAt > now) continue;
    adminSessionsById.delete(sessionId);
  }
};

const setAdminSessionCookie = (response: express.Response, sessionId: string) => {
  response.cookie(adminSessionCookieName, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: getEnv("ADMIN_SESSION_SECURE", "false").toLowerCase() === "true",
    path: "/",
    maxAge: adminSessionTtlMs,
  });
};

const clearAdminSessionCookie = (response: express.Response) => {
  response.clearCookie(adminSessionCookieName, { path: "/" });
};

const getSessionIdFromRequest = (request: express.Request): string => {
  const cookies = parseCookieHeader(String(request.headers?.cookie || ""));
  const cookieSessionId = String(cookies[adminSessionCookieName] || "").trim();
  if (cookieSessionId) return cookieSessionId;

  const authorization = String(request.headers?.authorization || "").trim();
  if (!authorization) return "";
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return "";
  return String(token || "").trim();
};

const createAdminSession = ({
  uid,
  email,
  profile,
}: {
  uid: string;
  email: string;
  profile: AdminProfile;
}): AdminSession => {
  clearExpiredAdminSessions();
  const nowIso = new Date().toISOString();
  const expiresAt = new Date(Date.now() + adminSessionTtlMs).toISOString();
  const session: AdminSession = {
    id: crypto.randomUUID(),
    uid: String(uid || "").trim(),
    email: String(email || "").trim(),
    profile,
    createdAt: nowIso,
    expiresAt,
  };
  adminSessionsById.set(session.id, session);
  return session;
};

const getAdminSessionFromRequest = (request: express.Request): AdminSession | null => {
  clearExpiredAdminSessions();
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) return null;
  return adminSessionsById.get(sessionId) || null;
};

const requireAdminSession = (request: AdminRequest, response: express.Response, next: express.NextFunction) => {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    response.status(401).json({ error: "Admin authentication is required." });
    return;
  }

  request.adminSession = session;
  next();
};

const normalizeSessionCode = (code: unknown): string =>
  String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

const accessCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generateAccessCode = (length = 8): string => {
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (byte) => accessCodeAlphabet[byte % accessCodeAlphabet.length]).join("");
};

const createUniqueAccessCode = async (): Promise<string> => {
  const db = getRealtimeDb();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = generateAccessCode();
    const snapshot = await db.ref(`${sessionsPath}/${code}`).once("value");
    if (!snapshot.exists()) return code;
  }
  throw new Error("Unable to generate a unique access code.");
};

const normalizeSessionGrades = (value: any): Record<string, string> => {
  if (!value || typeof value !== "object") return {};
  const normalized: Record<string, string> = {};
  Object.entries(value).forEach(([subject, grade]) => {
    const subjectCode = String(subject || "").trim().toUpperCase();
    const normalizedGrade = String(grade || "").trim().toUpperCase();
    if (!subjectCode || !normalizedGrade) return;
    normalized[subjectCode] = normalizedGrade;
  });
  return normalized;
};

const normalizeSessionResults = (value: any): Record<number, number> => {
  const raw = value && typeof value === "object" ? value : {};
  const normalized: Record<number, number> = {};
  for (let cluster = 1; cluster <= 20; cluster += 1) {
    const score = Number((raw as any)[cluster] ?? (raw as any)[String(cluster)] ?? 0);
    normalized[cluster] = Number.isFinite(score) ? score : 0;
  }
  return normalized;
};

const toRequirementsObject = (requirementsValue: any): Record<string, string> => {
  if (!requirementsValue) return {};
  if (Array.isArray(requirementsValue)) {
    const objectRequirements: Record<string, string> = {};
    requirementsValue.forEach((entry) => {
      if (!entry) return;
      if (typeof entry === "string" && entry.includes(":")) {
        const [subject, grade] = entry.split(":");
        objectRequirements[String(subject).trim()] = String(grade).trim();
      } else if ((entry as any).subject && (entry as any).grade) {
        objectRequirements[String((entry as any).subject).trim()] = String((entry as any).grade).trim();
      }
    });
    return objectRequirements;
  }
  if (typeof requirementsValue === "object") return requirementsValue as Record<string, string>;
  return {};
};

const toUniversitiesArray = (universitiesValue: any): { name: string; cutoff: number; courseCode: string }[] => {
  if (!universitiesValue) return [];
  const source = Array.isArray(universitiesValue)
    ? universitiesValue
    : Object.values(universitiesValue as Record<string, unknown>);

  return source
    .map((entry: any) => ({
      name: String(entry?.name || "").trim(),
      cutoff: Number(entry?.cutoff ?? 0),
      courseCode: String(entry?.courseCode || "").trim(),
    }))
    .filter((entry) => Boolean(entry.name));
};

const normalizeCourse = (rawCourse: any, fallbackName = ""): NormalizedCourse => ({
  name: String(rawCourse?.name || fallbackName).trim(),
  requirements: toRequirementsObject(rawCourse?.requirements),
  universities: toUniversitiesArray(rawCourse?.universities),
});

const normalizeClusterValue = (clusterValue: any): NormalizedCourse[] => {
  const items = Array.isArray(clusterValue) ? clusterValue : Object.values(clusterValue || {});
  return items
    .map((entry) => normalizeCourse(entry))
    .filter((course) => Boolean(course.name));
};

const normalizeCourseCatalog = (raw: any): NormalizedCatalog => {
  if (!raw || typeof raw !== "object") return {};

  const normalized: NormalizedCatalog = {};
  const rawEntries = Object.entries(raw);
  const looksLikeClusterMap = rawEntries.every(([key, value]) => {
    const clusterNumber = Number(key);
    return Number.isInteger(clusterNumber) && clusterNumber >= 1 && typeof value === "object";
  });

  if (looksLikeClusterMap) {
    rawEntries.forEach(([clusterKey, clusterValue]) => {
      normalized[Number(clusterKey)] = normalizeClusterValue(clusterValue);
    });
    return normalized;
  }

  rawEntries.forEach(([courseKey, courseValue]) => {
    const cluster = Number((courseValue as any)?.cluster);
    if (!Number.isInteger(cluster) || cluster < 1) return;
    if (!normalized[cluster]) normalized[cluster] = [];
    normalized[cluster].push(normalizeCourse(courseValue, courseKey));
  });

  return normalized;
};

const normalizeRequirementsMap = (requirements: any): Record<string, string> => {
  const normalized: Record<string, string> = {};
  Object.entries(toRequirementsObject(requirements)).forEach(([subject, grade]) => {
    const normalizedSubject = String(subject || "").trim();
    const normalizedGrade = String(grade || "").trim().toUpperCase();
    if (!normalizedSubject || !normalizedGrade) return;
    normalized[normalizedSubject] = normalizedGrade;
  });
  return normalized;
};

const normalizeUniversityEntry = (entry: any): { name: string; courseCode: string; cutoff: number } | null => {
  const name = String(entry?.name || "").trim();
  if (!name) return null;
  const courseCode = String(entry?.courseCode || "").trim();
  const cutoffValue = Number(entry?.cutoff ?? 0);
  return {
    name,
    courseCode,
    cutoff: Number.isFinite(cutoffValue) ? cutoffValue : 0,
  };
};

const universityKey = (entry: { name: string; courseCode: string }) =>
  `${String(entry?.name || "").trim().toLowerCase()}|${String(entry?.courseCode || "").trim().toLowerCase()}`;

const mergeUniversityEntries = (
  existingUniversities: { name: string; courseCode: string; cutoff: number }[] = [],
  nextUniversities: { name: string; courseCode: string; cutoff: number }[] = [],
) => {
  const map = new Map<string, { name: string; courseCode: string; cutoff: number }>();
  [...existingUniversities, ...nextUniversities].forEach((entry) => {
    const normalized = normalizeUniversityEntry(entry);
    if (!normalized) return;
    map.set(universityKey(normalized), normalized);
  });
  return Array.from(map.values());
};

const fetchCourseCatalogFromDb = async (): Promise<NormalizedCatalog> => {
  const snapshot = await getRealtimeDb().ref(courseCatalogPath).once("value");
  if (!snapshot.exists()) return {};
  return normalizeCourseCatalog(snapshot.val());
};

const uploadCourseCatalogToDb = async (catalog: any): Promise<void> => {
  if (!catalog || typeof catalog !== "object") {
    throw new Error("Invalid course catalog payload.");
  }
  await getRealtimeDb().ref(courseCatalogPath).set(catalog);
};

const upsertSingleCourseCatalogEntryInDb = async ({
  cluster,
  name,
  requirements,
  universities,
}: {
  cluster: number;
  name: string;
  requirements: any;
  universities: any[];
}): Promise<NormalizedCourse> => {
  const normalizedCluster = Number(cluster);
  if (!Number.isInteger(normalizedCluster) || normalizedCluster < 1) {
    throw new Error("Cluster must be a positive whole number.");
  }

  const normalizedName = String(name || "").trim();
  if (!normalizedName) {
    throw new Error("Course name is required.");
  }

  const normalizedRequirements = normalizeRequirementsMap(requirements);
  const normalizedUniversities = toUniversitiesArray(universities)
    .map((entry) => normalizeUniversityEntry(entry))
    .filter((entry): entry is { name: string; courseCode: string; cutoff: number } => Boolean(entry));

  if (!normalizedUniversities.length) {
    throw new Error("At least one university entry is required.");
  }

  const catalog = await fetchCourseCatalogFromDb();
  const clusterCourses = Array.isArray(catalog[normalizedCluster]) ? [...catalog[normalizedCluster]] : [];
  const existingIndex = clusterCourses.findIndex(
    (course) => String(course?.name || "").trim().toLowerCase() === normalizedName.toLowerCase(),
  );

  const mergedCourse: NormalizedCourse =
    existingIndex >= 0
      ? {
          name: normalizedName,
          requirements: {
            ...normalizeRequirementsMap(clusterCourses[existingIndex]?.requirements),
            ...normalizedRequirements,
          },
          universities: mergeUniversityEntries(
            (clusterCourses[existingIndex]?.universities as any) || [],
            normalizedUniversities as any,
          ),
        }
      : {
          name: normalizedName,
          requirements: normalizedRequirements,
          universities: normalizedUniversities,
        };

  if (existingIndex >= 0) clusterCourses[existingIndex] = mergedCourse;
  else clusterCourses.push(mergedCourse);

  catalog[normalizedCluster] = clusterCourses;
  await getRealtimeDb().ref(courseCatalogPath).set(catalog);
  return mergedCourse;
};

const saveClusterSessionInDb = async ({
  code,
  email,
  phoneNumber,
  amountPaid,
  grades,
  results,
  medicineEligible,
  paymentResponse,
}: {
  code?: string;
  email: string;
  phoneNumber: string;
  amountPaid: number;
  grades: Record<string, string>;
  results: Record<string, number>;
  medicineEligible: boolean;
  paymentResponse: any;
}): Promise<ClusterSessionPayload> => {
  const db = getRealtimeDb();
  const normalizedEmail = String(email || "").trim();
  const normalizedCode = normalizeSessionCode(code);
  const timestamp = new Date().toISOString();
  let resolvedCode = normalizedCode;
  let createdAt = timestamp;

  if (normalizedCode) {
    const snapshot = await db.ref(`${sessionsPath}/${normalizedCode}`).once("value");
    if (snapshot.exists()) {
      const existing: any = snapshot.val() || {};
      const existingEmail = String(existing.email || "").trim().toLowerCase();
      if (existingEmail && existingEmail === normalizedEmail.toLowerCase()) {
        createdAt = String(existing.createdAt || timestamp);
      } else {
        const error: any = new Error("Access code already exists.");
        error.statusCode = 409;
        throw error;
      }
    }
  }

  if (!resolvedCode) {
    resolvedCode = await createUniqueAccessCode();
  }

  const payload: ClusterSessionPayload = {
    code: resolvedCode,
    email: normalizedEmail,
    phoneNumber: String(phoneNumber || "").trim(),
    amountPaid: Number(amountPaid ?? 0),
    grades: normalizeSessionGrades(grades),
    results: normalizeSessionResults(results),
    medicineEligible: Boolean(medicineEligible),
    paymentResponse: paymentResponse || null,
    createdAt,
    updatedAt: timestamp,
    storage: "firebase",
  };

  await db.ref(`${sessionsPath}/${resolvedCode}`).set(payload);
  return payload;
};

const fetchClusterSessionByCodeFromDb = async (code: string): Promise<ClusterSessionPayload | null> => {
  const normalizedCode = normalizeSessionCode(code);
  if (!normalizedCode) return null;

  const snapshot = await getRealtimeDb().ref(`${sessionsPath}/${normalizedCode}`).once("value");
  if (!snapshot.exists()) return null;
  const value: any = snapshot.val() || {};

  return {
    code: normalizedCode,
    email: String(value.email || "").trim(),
    phoneNumber: String(value.phoneNumber || "").trim(),
    amountPaid: Number(value.amountPaid ?? 0),
    grades: normalizeSessionGrades(value.grades),
    results: normalizeSessionResults(value.results),
    medicineEligible: Boolean(value.medicineEligible),
    paymentResponse: value.paymentResponse || null,
    createdAt: String(value.createdAt || ""),
    updatedAt: String(value.updatedAt || ""),
    storage: "firebase",
  };
};

const fetchAllClusterSessionsFromDb = async (): Promise<ClusterSessionPayload[]> => {
  const snapshot = await getRealtimeDb().ref(sessionsPath).once("value");
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val() || {})
    .map(([code, value]) => {
      const sessionCode = normalizeSessionCode(code);
      const payload: any = value && typeof value === "object" ? value : {};
      return {
        code: sessionCode,
        email: String(payload.email || "").trim(),
        phoneNumber: String(payload.phoneNumber || "").trim(),
        amountPaid: Number(payload.amountPaid ?? 0),
        createdAt: String(payload.createdAt || ""),
        updatedAt: String(payload.updatedAt || ""),
        medicineEligible: Boolean(payload.medicineEligible),
        grades: normalizeSessionGrades(payload.grades),
        results: normalizeSessionResults(payload.results),
        paymentResponse: payload.paymentResponse || null,
        storage: "firebase" as const,
      };
    })
    .filter((session) => session.code)
    .sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0));
};

const updateClusterSessionByCodeInDb = async (code: string, patch: any = {}): Promise<void> => {
  const normalizedCode = normalizeSessionCode(code);
  if (!normalizedCode) throw new Error("Session code is required.");
  if (!patch || typeof patch !== "object") throw new Error("Invalid session patch payload.");

  const sessionRef = getRealtimeDb().ref(`${sessionsPath}/${normalizedCode}`);
  const snapshot = await sessionRef.once("value");
  if (!snapshot.exists()) throw new Error("Session not found.");

  const payload: any = {};
  if ("email" in patch) payload.email = String(patch.email || "").trim();
  if ("phoneNumber" in patch) payload.phoneNumber = String(patch.phoneNumber || "").trim();
  if ("medicineEligible" in patch) payload.medicineEligible = Boolean(patch.medicineEligible);
  if ("grades" in patch) payload.grades = normalizeSessionGrades(patch.grades);
  if ("results" in patch) payload.results = normalizeSessionResults(patch.results);
  if ("paymentResponse" in patch) payload.paymentResponse = patch.paymentResponse ?? null;
  if ("amountPaid" in patch) {
    const amount = Number(patch.amountPaid ?? 0);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Amount paid must be a valid number equal to or greater than 0.");
    }
    payload.amountPaid = amount;
  }
  payload.updatedAt = new Date().toISOString();

  await sessionRef.update(payload);
};

const deleteClusterSessionByCodeInDb = async (code: string): Promise<void> => {
  const normalizedCode = normalizeSessionCode(code);
  if (!normalizedCode) throw new Error("Session code is required.");
  await getRealtimeDb().ref(`${sessionsPath}/${normalizedCode}`).remove();
};

const deleteClusterSessionsByCodesInDb = async (codes: string[] = []): Promise<number> => {
  const normalizedCodes = Array.from(
    new Set((Array.isArray(codes) ? codes : []).map((code) => normalizeSessionCode(code)).filter(Boolean)),
  );
  if (!normalizedCodes.length) return 0;

  const updates: Record<string, null> = {};
  normalizedCodes.forEach((code) => {
    updates[`${sessionsPath}/${code}`] = null;
  });
  await getRealtimeDb().ref().update(updates);
  return normalizedCodes.length;
};

const fetchAdminProfileByUid = async (uid: string): Promise<AdminProfile | null> => {
  const normalizedUid = String(uid || "").trim();
  if (!normalizedUid) return null;

  const snapshot = await getRealtimeDb().ref(`${adminsPath}/${normalizedUid}`).once("value");
  if (!snapshot.exists()) return null;
  const value: any = snapshot.val() || {};
  return {
    uid: normalizedUid,
    email: String(value.email || "").trim(),
    name: String(value.name || "").trim(),
    role: String(value.role || "regular").trim() || "regular",
    active: value.active !== false,
    createdAt: String(value.createdAt || ""),
    updatedAt: String(value.updatedAt || ""),
    createdBy: String(value.createdBy || ""),
  };
};

const upsertAdminProfileByUid = async (uid: string, patch: Partial<AdminProfile>): Promise<AdminProfile> => {
  const normalizedUid = String(uid || "").trim();
  if (!normalizedUid) throw new Error("Admin uid is required.");

  const existing = await fetchAdminProfileByUid(normalizedUid);
  const timestamp = new Date().toISOString();
  const payload: AdminProfile = {
    uid: normalizedUid,
    email: String(patch?.email ?? existing?.email ?? "").trim(),
    name: String(patch?.name ?? existing?.name ?? "").trim(),
    role: String(patch?.role ?? existing?.role ?? "regular").trim() || "regular",
    active: patch?.active ?? existing?.active ?? true,
    createdBy: String(patch?.createdBy ?? existing?.createdBy ?? "").trim(),
    createdAt: existing?.createdAt || patch?.createdAt || timestamp,
    updatedAt: timestamp,
  };

  await getRealtimeDb().ref(`${adminsPath}/${normalizedUid}`).set(payload);
  return payload;
};

const ensureAdminProfileForUser = async ({
  uid,
  email,
  displayName,
}: {
  uid: string;
  email: string;
  displayName?: string;
}): Promise<AdminProfile | null> => {
  const profile = await fetchAdminProfileByUid(uid);
  if (profile) return profile;

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (superAdminEmail && normalizedEmail && normalizedEmail === superAdminEmail) {
    return upsertAdminProfileByUid(uid, {
      email: normalizedEmail,
      name: String(displayName || "Super Admin").trim(),
      role: "super",
      active: true,
    });
  }

  return null;
};

const getFirebaseApiKey = () => {
  const apiKey = firstEnv("FIREBASE_API_KEY", "FIREBASE_WEB_API_KEY", "VITE_FIREBASE_API_KEY");
  if (!apiKey) {
    throw new Error("FIREBASE_API_KEY is not configured on backend.");
  }
  return apiKey;
};

const parseFirebaseAuthError = (payload: any, fallback: string): string => {
  const firebaseCode = String(payload?.error?.message || "").trim();
  if (firebaseCode === "INVALID_LOGIN_CREDENTIALS" || firebaseCode === "EMAIL_NOT_FOUND" || firebaseCode === "INVALID_PASSWORD") {
    return "Invalid email or password.";
  }
  if (firebaseCode === "EMAIL_EXISTS") {
    return "This email is already registered.";
  }
  if (firebaseCode === "OPERATION_NOT_ALLOWED") {
    return "Email/password sign-in is disabled in Firebase Auth settings.";
  }
  return firebaseCode || fallback;
};

const signInWithEmailPasswordViaFirebase = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const apiKey = getFirebaseApiKey();

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(
    apiKey,
  )}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: String(email || "").trim(),
      password: String(password || ""),
      returnSecureToken: true,
    }),
  });

  const payload: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseFirebaseAuthError(payload, "Firebase email/password sign-in failed."));
  }

  const idToken = String(payload?.idToken || "").trim();
  if (!idToken) throw new Error("Login failed: missing idToken.");
  const uid = String(payload?.localId || "").trim();
  if (!uid) throw new Error("Login failed: missing Firebase uid.");
  const resolvedEmail = String(payload?.email || email).trim().toLowerCase();
  const displayName = String(payload?.displayName || "").trim();

  return { idToken, uid, email: resolvedEmail, displayName, payload };
};

const createEmailPasswordUserViaFirebase = async ({
  email,
  password,
  displayName,
}: {
  email: string;
  password: string;
  displayName?: string;
}) => {
  const apiKey = getFirebaseApiKey();
  const signupEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(apiKey)}`;
  const signupResponse = await fetch(signupEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
      returnSecureToken: true,
    }),
  });

  const signupPayload: any = await signupResponse.json().catch(() => ({}));
  if (!signupResponse.ok) {
    throw new Error(parseFirebaseAuthError(signupPayload, "Firebase user creation failed."));
  }

  const uid = String(signupPayload?.localId || "").trim();
  if (!uid) throw new Error("Firebase user creation failed: missing uid.");

  const idToken = String(signupPayload?.idToken || "").trim();
  const normalizedDisplayName = String(displayName || "").trim();
  if (normalizedDisplayName && idToken) {
    const updateEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${encodeURIComponent(apiKey)}`;
    const updateResponse = await fetch(updateEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
        displayName: normalizedDisplayName,
        returnSecureToken: false,
      }),
    });
    if (!updateResponse.ok) {
      const updatePayload: any = await updateResponse.json().catch(() => ({}));
      logger.warn("Firebase displayName update failed after user creation", {
        uid,
        email,
        error: String(updatePayload?.error?.message || "").trim(),
      });
    }
  }

  return {
    uid,
    email: String(signupPayload?.email || email).trim().toLowerCase(),
    displayName: normalizedDisplayName,
  };
};

const withAsyncGuard =
  (handlerName: string, handler: express.RequestHandler): express.RequestHandler =>
  async (request, response, next) => {
    try {
      await handler(request, response, next);
    } catch (error) {
      logger.error("Unhandled route runtime error", {
        requestId: ensureRequestId(request as any),
        handler: handlerName,
        method: request.method,
        path: getRequestPath(request),
        body: summarizeBody(getBody(request)),
        ...safeErrorObject(error),
      });

      if (typeof next === "function") {
        next(error);
        return;
      }

      if (!response.headersSent) {
        response.status(500).json({
          error: "Internal server error.",
          requestId: ensureRequestId(request as any),
        });
      }
    }
  };

const requireEnv = (key: string): string => {
  const value = getEnv(key);
  if (!value) {
    const error: any = new Error(`${key} is not configured.`);
    error.statusCode = 500;
    throw error;
  }
  return value;
};

const getBody = (request: express.Request): any =>
  request.body && typeof request.body === "object" ? request.body : {};

const assertMethod = (request: express.Request, response: express.Response, method: string = "POST") => {
  if (request.method === method) return true;
  response.status(405).json({ error: `Method ${request.method} is not allowed. Use ${method}.` });
  return false;
};

const phoneDigitsOnly = (value: unknown) => String(value || "").replace(/\D/g, "");

const normalizeKenyanPhone = (value: unknown) => {
  const digits = phoneDigitsOnly(value);
  if (!digits) throw new Error("Phone number is required.");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `254${digits}`;
  throw new Error("Use a valid Kenyan phone number, e.g. 0712345678 or 254712345678.");
};

const normalizeAmount = (value: unknown) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a number greater than 0.");
  }
  return Math.round(amount);
};

const formatDarajaTimestamp = () => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter
    .formatToParts(new Date())
    .filter((part) => part.type !== "literal")
    .reduce<Record<string, string>>((accumulator, part) => {
      accumulator[part.type] = part.value;
      return accumulator;
    }, {});

  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}`;
};

const getDarajaBaseUrl = () => {
  const environment = getEnv("MPESA_ENVIRONMENT", "sandbox").toLowerCase();
  return environment === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
};

// Use explicit callback URLs from environment for Daraja
const getDarajaCallbackUrl = () => {
  const genericCallback = getEnv("MPESA_CALLBACK_URL");
  const localCallback = getEnv("MPESA_CALLBACK_URL_LOCAL");
  const firebaseCallback = getEnv("MPESA_CALLBACK_URL_FIREBASE");
  return genericCallback || localCallback || firebaseCallback;
};

type PaymentSession = {
  checkoutRequestId: string;
  merchantRequestId: string;
  phone: string;
  amount: number;
  status: "pending" | "success" | "failed";
  resultCode: number | null;
  resultDesc: string;
  responseDescription: string;
  customerMessage: string;
  initiationResponse: any;
  callbackMetadata: any;
  callbackPayload: any;
  createdAt: string;
  updatedAt: string;
};

const paymentSessionsByCheckoutId = new Map<string, PaymentSession>();
const checkoutIdByMerchantRequestId = new Map<string, string>();
const paymentSessionTtlMs = Number(getEnv("PAYMENT_SESSION_TTL_MS", `${6 * 60 * 60 * 1000}`)) || 6 * 60 * 60 * 1000;

const normalizeRequestIdentifier = (value: unknown) => String(value || "").trim();

const cleanupExpiredPaymentSessions = () => {
  const cutoff = Date.now() - paymentSessionTtlMs;
  for (const [checkoutRequestId, session] of paymentSessionsByCheckoutId.entries()) {
    const updatedAt = Date.parse(session?.updatedAt || session?.createdAt || "") || 0;
    if (!updatedAt || updatedAt >= cutoff) continue;
    paymentSessionsByCheckoutId.delete(checkoutRequestId);
    if (session?.merchantRequestId) {
      checkoutIdByMerchantRequestId.delete(session.merchantRequestId);
    }
  }
};

const resolveCheckoutRequestId = ({
  checkoutRequestId,
  merchantRequestId,
}: {
  checkoutRequestId?: string;
  merchantRequestId?: string;
}) => {
  const normalizedCheckoutRequestId = normalizeRequestIdentifier(checkoutRequestId);
  if (normalizedCheckoutRequestId) return normalizedCheckoutRequestId;

  const normalizedMerchantRequestId = normalizeRequestIdentifier(merchantRequestId);
  if (!normalizedMerchantRequestId) return "";
  return checkoutIdByMerchantRequestId.get(normalizedMerchantRequestId) || "";
};

const getPaymentSession = ({
  checkoutRequestId,
  merchantRequestId,
}: {
  checkoutRequestId?: string;
  merchantRequestId?: string;
}): PaymentSession | null => {
  cleanupExpiredPaymentSessions();
  const resolvedCheckoutRequestId = resolveCheckoutRequestId({ checkoutRequestId, merchantRequestId });
  if (!resolvedCheckoutRequestId) return null;
  return paymentSessionsByCheckoutId.get(resolvedCheckoutRequestId) || null;
};

const savePaymentSession = (session: PaymentSession | null) => {
  if (!session?.checkoutRequestId) return null;
  paymentSessionsByCheckoutId.set(session.checkoutRequestId, session);
  if (session.merchantRequestId) {
    checkoutIdByMerchantRequestId.set(session.merchantRequestId, session.checkoutRequestId);
  }
  return session;
};

const upsertPaymentSession = (patch: Partial<PaymentSession>): PaymentSession | null => {
  cleanupExpiredPaymentSessions();
  const normalizedCheckoutRequestId = normalizeRequestIdentifier(patch?.checkoutRequestId);
  const normalizedMerchantRequestId = normalizeRequestIdentifier(patch?.merchantRequestId);
  const resolvedCheckoutRequestId =
    normalizedCheckoutRequestId || checkoutIdByMerchantRequestId.get(normalizedMerchantRequestId) || "";
  if (!resolvedCheckoutRequestId) return null;

  const existing = paymentSessionsByCheckoutId.get(resolvedCheckoutRequestId) || null;
  const now = new Date().toISOString();
  const session: PaymentSession = {
    checkoutRequestId: resolvedCheckoutRequestId,
    merchantRequestId: normalizedMerchantRequestId || existing?.merchantRequestId || "",
    phone: String(patch?.phone ?? existing?.phone ?? "").trim(),
    amount: Number(patch?.amount ?? existing?.amount ?? 0),
    status: (String(patch?.status || existing?.status || "pending").trim() || "pending") as PaymentSession["status"],
    resultCode:
      patch?.resultCode !== undefined && patch?.resultCode !== null
        ? Number(patch.resultCode)
        : existing?.resultCode ?? null,
    resultDesc: String(patch?.resultDesc ?? existing?.resultDesc ?? "").trim(),
    responseDescription: String(patch?.responseDescription ?? existing?.responseDescription ?? "").trim(),
    customerMessage: String(patch?.customerMessage ?? existing?.customerMessage ?? "").trim(),
    initiationResponse: patch?.initiationResponse ?? existing?.initiationResponse ?? null,
    callbackMetadata: patch?.callbackMetadata ?? existing?.callbackMetadata ?? null,
    callbackPayload: patch?.callbackPayload ?? existing?.callbackPayload ?? null,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  return savePaymentSession(session);
};

const metadataArrayToObject = (items: any) =>
  Array.isArray(items)
    ? items.reduce<Record<string, any>>((accumulator, item) => {
        const key = String(item?.Name || "").trim();
        if (!key) return accumulator;
        accumulator[key] = item?.Value ?? "";
        return accumulator;
      }, {})
    : {};

const parseDarajaCallback = (body: any) => {
  const callback = body?.Body?.stkCallback || body?.stkCallback || body?.body?.stkCallback || {};
  const metadata = metadataArrayToObject(callback?.CallbackMetadata?.Item);
  return {
    merchantRequestId: normalizeRequestIdentifier(callback?.MerchantRequestID),
    checkoutRequestId: normalizeRequestIdentifier(callback?.CheckoutRequestID),
    resultCode:
      callback?.ResultCode !== undefined && callback?.ResultCode !== null ? Number(callback.ResultCode) : null,
    resultDesc: String(callback?.ResultDesc || "").trim(),
    metadata,
  };
};

const mapDarajaResultCodeToStatus = (resultCode: number): "pending" | "success" | "failed" => {
  if (!Number.isFinite(resultCode)) return "pending";
  if (resultCode === 0) return "success";
  if ([1, 1032, 1037, 2001].includes(resultCode)) return "failed";
  return "pending";
};

const normalizeGradesPayload = (value: any) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("grades must be an object keyed by subject code.");
  }

  return Object.entries(value).reduce<Record<string, string>>((accumulator, [subjectCode, grade]) => {
    const normalizedSubjectCode = String(subjectCode || "").trim().toUpperCase();
    const normalizedGrade = String(grade || "").trim().toUpperCase();
    if (!normalizedSubjectCode) return accumulator;
    accumulator[normalizedSubjectCode] = normalizedGrade;
    return accumulator;
  }, {});
};

type ClusterResultPayload = {
  source: string;
  results: Record<number, number>;
  medicineEligible: boolean;
};

type ClusterCacheEntry = {
  expiresAt: number;
  value: ClusterResultPayload;
};

const clusterCacheMaxEntries = Math.max(
  0,
  parseNumberEnv(getEnv("CLUSTER_CACHE_MAX", "200"), 200),
);
const clusterCacheTtlMs = Math.max(
  0,
  parseNumberEnv(getEnv("CLUSTER_CACHE_TTL_MS", `${10 * 60 * 1000}`), 10 * 60 * 1000),
);
const clusterCacheEnabled = clusterCacheMaxEntries > 0 && clusterCacheTtlMs > 0;

// In-memory cache for cluster calculation results (bounded + TTL)
const clusterResultsCache = new Map<string, ClusterCacheEntry>();

const pruneClusterResultsCache = () => {
  if (!clusterCacheEnabled) return;
  const now = Date.now();
  for (const [key, entry] of clusterResultsCache.entries()) {
    if (!entry || entry.expiresAt <= now) {
      clusterResultsCache.delete(key);
    }
  }
  while (clusterResultsCache.size > clusterCacheMaxEntries) {
    const oldestKey = clusterResultsCache.keys().next().value;
    if (!oldestKey) break;
    clusterResultsCache.delete(oldestKey);
  }
};

const getClusterCache = (cacheKey: string): ClusterResultPayload | null => {
  if (!clusterCacheEnabled) return null;
  const entry = clusterResultsCache.get(cacheKey);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    clusterResultsCache.delete(cacheKey);
    return null;
  }
  // Refresh LRU order
  clusterResultsCache.delete(cacheKey);
  clusterResultsCache.set(cacheKey, entry);
  return entry.value;
};

const setClusterCache = (cacheKey: string, value: ClusterResultPayload) => {
  if (!clusterCacheEnabled) return;
  clusterResultsCache.set(cacheKey, { value, expiresAt: Date.now() + clusterCacheTtlMs });
  pruneClusterResultsCache();
};

const calculateClusterResults = async (grades: any) => {
  const normalizedGrades = normalizeGradesPayload(grades);

  if (clusterCacheEnabled) {
    const cacheKey = JSON.stringify(normalizedGrades);
    const cached = getClusterCache(cacheKey);
    if (cached) return cached;

    const value: ClusterResultPayload = {
      source: "express-server",
      results: computeAllClusters(normalizedGrades),
      medicineEligible: medicineEligibility(normalizedGrades),
    };
    setClusterCache(cacheKey, value);
    return value;
  }

  return {
    source: "express-server",
    results: computeAllClusters(normalizedGrades),
    medicineEligible: medicineEligibility(normalizedGrades),
  };
};

type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

const getFirebasePublicConfig = (): FirebasePublicConfig => ({
  apiKey: firstEnv("FIREBASE_API_KEY", "FIREBASE_WEB_API_KEY", "VITE_FIREBASE_API_KEY"),
  authDomain: firstEnv("FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_AUTH_DOMAIN"),
  databaseURL: firstEnv("FIREBASE_DATABASE_URL", "VITE_FIREBASE_DATABASE_URL"),
  projectId: firstEnv("FIREBASE_PROJECT_ID", "VITE_FIREBASE_PROJECT_ID"),
  storageBucket: firstEnv("FIREBASE_STORAGE_BUCKET", "VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: firstEnv("FIREBASE_MESSAGING_SENDER_ID", "VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: firstEnv("FIREBASE_APP_ID", "VITE_FIREBASE_APP_ID"),
  measurementId: firstEnv("FIREBASE_MEASUREMENT_ID", "VITE_MEASUREMENT_ID"),
});

const hasValidFirebasePublicConfig = (config: FirebasePublicConfig): boolean =>
  Boolean(config.apiKey && config.authDomain && config.databaseURL && config.projectId);

const getDarajaToken = async () => {
  const consumerKey = requireEnv("MPESA_CONSUMER_KEY");
  const consumerSecret = requireEnv("MPESA_CONSUMER_SECRET");
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const tokenEndpoint = `${getDarajaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;

  let response: Response;
  try {
    response = await fetch(tokenEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });
  } catch (error: any) {
    const wrapped: any = new Error(
      `Unable to reach Daraja auth endpoint. ${error?.message || "Network request failed."}`,
    );
    wrapped.statusCode = 502;
    throw wrapped;
  }

  const payload: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error: any = new Error(
      payload.errorMessage || payload.error || `Daraja auth failed with HTTP ${response.status}.`,
    );
    error.statusCode = response.status;
    throw error;
  }

  if (!payload.access_token) {
    throw new Error("Daraja auth response did not include access_token.");
  }

  return payload.access_token as string;
};

const getDarajaTransactionType = () => {
  const shortcodeType = getEnv("MPESA_SHORTCODE_TYPE", "till_number")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (shortcodeType === "paybill" || shortcodeType === "customerpaybillonline") {
    return "CustomerPayBillOnline";
  }

  if (
    shortcodeType === "tillnumber" ||
    shortcodeType === "buygoods" ||
    shortcodeType === "customerbuygoodsonline"
  ) {
    return "CustomerBuyGoodsOnline";
  }

  const error: any = new Error(
    "Invalid MPESA_SHORTCODE_TYPE. Use paybill, till_number, CustomerPayBillOnline, or CustomerBuyGoodsOnline.",
  );
  error.statusCode = 500;
  throw error;
};

const requestStkPush = async ({
  phone,
  amount,
  accountReference,
  transactionDesc,
}: {
  phone: string;
  amount: number;
  accountReference?: string;
  transactionDesc?: string;
}) => {
  const callbackUrl = getDarajaCallbackUrl();
  if (!callbackUrl) {
    const error: any = new Error(
      "M-Pesa callback URL is not configured. Set MPESA_CALLBACK_URL, MPESA_CALLBACK_URL_LOCAL, or MPESA_CALLBACK_URL_FIREBASE on backend.",
    );
    error.statusCode = 500;
    throw error;
  }
  const shortCode = requireEnv("MPESA_SHORTCODE");
  const businessShortCode =
    firstEnv("MPESA_BUSINESS_SHORTCODE", "MPESA_EXPRESS_SHORTCODE", "MPESA_BUSINESS_SHORT_CODE", "MPESA_SHORTCODE") ||
    shortCode;
  const passkey = requireEnv("MPESA_PASSKEY");

  const normalizedPhone = normalizeKenyanPhone(phone);
  const normalizedAmount = normalizeAmount(amount);
  const timestamp = formatDarajaTimestamp();
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
  const accessToken = await getDarajaToken();

  const stkPayload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: getDarajaTransactionType(),
    Amount: normalizedAmount,
    PartyA: normalizedPhone,
    PartyB: businessShortCode,
    PhoneNumber: normalizedPhone,
    CallBackURL: callbackUrl,
    AccountReference: String(accountReference || "KUCCPS-CLUSTER").slice(0, 12),
    TransactionDesc: String(transactionDesc || "Cluster payment").slice(0, 13),
  };

  const endpoint = `${getDarajaBaseUrl()}/mpesa/stkpush/v1/processrequest`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });
  } catch (error: any) {
    const wrapped: any = new Error(
      `Unable to reach Daraja STK endpoint. ${error?.message || "Network request failed."}`,
    );
    wrapped.statusCode = 502;
    throw wrapped;
  }

  const payload: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error: any = new Error(
      payload.errorMessage || payload.errorCode || `Daraja STK request failed with HTTP ${response.status}.`,
    );
    error.statusCode = response.status;
    throw error;
  }

  return payload;
};

const queryStkPushStatus = async ({ checkoutRequestId }: { checkoutRequestId: string }) => {
  const normalizedCheckoutRequestId = normalizeRequestIdentifier(checkoutRequestId);
  if (!normalizedCheckoutRequestId) {
    throw new Error("checkoutRequestId is required.");
  }

  const shortCode = requireEnv("MPESA_SHORTCODE");
  const passkey = requireEnv("MPESA_PASSKEY");
  const timestamp = formatDarajaTimestamp();
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
  const accessToken = await getDarajaToken();

  const endpoint = `${getDarajaBaseUrl()}/mpesa/stkpushquery/v1/query`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: normalizedCheckoutRequestId,
      }),
    });
  } catch (error: any) {
    const wrapped: any = new Error(
      `Unable to reach Daraja query endpoint. ${error?.message || "Network request failed."}`,
    );
    wrapped.statusCode = 502;
    throw wrapped;
  }

  const payload: any = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error: any = new Error(
      payload?.errorMessage || payload?.errorCode || `Daraja STK query failed with HTTP ${response.status}.`,
    );
    error.statusCode = response.status;
    throw error;
  }

  return payload;
};

let emailTransport: nodemailer.Transporter | null = null;

const getEmailTransport = () => {
  if (emailTransport) return emailTransport;

  const user = requireEnv("EMAIL_HOST_USER");
  const pass = requireEnv("EMAIL_HOST_PASSWORD");
  const host = getEnv("EMAIL_HOST", "smtp.gmail.com");
  const port = Number(getEnv("EMAIL_HOST_PORT", "465"));
  const secure = getEnv("EMAIL_HOST_SECURE", port === 465 ? "true" : "false").toLowerCase() === "true";

  emailTransport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return emailTransport;
};

const sanitizeHeaderValue = (value: unknown) => String(value || "").replace(/[\r\n]+/g, " ").trim();

const resolveLocalEnvPath = () => {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "..", ".env"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return "";
};

const loadLocalEnvFile = () => {
  // Node 20+ supports process.loadEnvFile. For plain Node, this is a no-op if unavailable.
  if (typeof (process as any).loadEnvFile !== "function") return;

  const envPath = resolveLocalEnvPath();
  if (!envPath) return;

  try {
    (process as any).loadEnvFile(envPath);
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      logger.debug("Local .env was not loaded", {
        message: error?.message || "Unknown .env load error.",
        envPath,
      });
    }
  }
};

loadLocalEnvFile();

let hasInstalledProcessHandlers = false;

const installProcessErrorHandlers = () => {
  if (hasInstalledProcessHandlers) return;
  hasInstalledProcessHandlers = true;

  process.on("unhandledRejection", (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason || "Unhandled rejection."));
    logger.error("Unhandled promise rejection", safeErrorObject(error));
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", safeErrorObject(error));
    if (!keepAliveOnFatal) {
      process.exitCode = 1;
      process.exit(1);
    }
  });

  process.on("uncaughtExceptionMonitor", (error) => {
    logger.error("Uncaught exception monitor", safeErrorObject(error));
  });
};

installProcessErrorHandlers();

const firebaseConfigHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("firebaseConfig", request);
  if (!["GET", "OPTIONS"].includes(request.method)) {
    response.status(405).json({ error: `Method ${request.method} is not allowed. Use GET.` });
    return;
  }

  const firebase = getFirebasePublicConfig();
  response.status(200).json({
    configured: hasValidFirebasePublicConfig(firebase),
    firebase,
    source: "express-env",
  });
};

const publicConfigHandler: express.RequestHandler = async (_request, response) => {
  response.status(200).json({
    payableAmount,
    backend: "backend-server",
    timestamp: new Date().toISOString(),
  });
};

const adminLoginHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("adminLogin", request);
  if (!assertMethod(request, response, "POST")) return;

  const body = getBody(request);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  if (!email || !password) {
    response.status(400).json({ error: "Email and password are required." });
    return;
  }

  const login = await signInWithEmailPasswordViaFirebase({ email, password });

  const profile = await ensureAdminProfileForUser({
    uid: login.uid,
    email: login.email || email,
    displayName: login.displayName || "",
  });

  if (!profile || profile.active === false) {
    const hint = superAdminEmail
      ? "Ask a super admin to add or re-activate this account."
      : "Set SUPER_ADMIN_EMAIL in the backend env to bootstrap a super admin.";
    response.status(403).json({ error: `This account is not registered as an active admin. ${hint}` });
    return;
  }

  const session = createAdminSession({
    uid: login.uid,
    email: login.email || email,
    profile,
  });

  setAdminSessionCookie(response, session.id);
  response.status(200).json({
    success: true,
    user: { uid: session.uid, email: session.email },
    profile: session.profile,
  });
};

const adminMeHandler: express.RequestHandler = async (request, response) => {
  const adminRequest = request as AdminRequest;
  const session = adminRequest.adminSession || null;
  if (!session) {
    response.status(401).json({ error: "Admin authentication is required." });
    return;
  }

  response.status(200).json({
    success: true,
    user: { uid: session.uid, email: session.email },
    profile: session.profile,
  });
};

const adminLogoutHandler: express.RequestHandler = async (request, response) => {
  const sessionId = getSessionIdFromRequest(request);
  if (sessionId) adminSessionsById.delete(sessionId);
  clearAdminSessionCookie(response);
  response.status(200).json({ success: true });
};

const adminHealthHandler: express.RequestHandler = async (request, response) => {
  const adminRequest = request as AdminRequest;
  const session = adminRequest.adminSession || null;
  if (!session) {
    response.status(401).json({ error: "Admin authentication is required." });
    return;
  }

  response.status(200).json({
    status: "ok",
    service: "kuccps-cluster-backend-server-admin",
    uid: session.uid,
    email: session.email,
    role: session.profile.role,
  });
};

const addRegularAdminHandler: express.RequestHandler = async (request, response) => {
  const adminRequest = request as AdminRequest;
  const session = adminRequest.adminSession || null;
  if (!session) {
    response.status(401).json({ error: "Admin authentication is required." });
    return;
  }

  if (session.profile.role !== "super") {
    response.status(403).json({ error: "Only a super admin can add regular admins." });
    return;
  }

  if (!assertMethod(request, response, "POST")) return;
  const body = getBody(request);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const name = String(body?.name || "").trim();
  if (!email || !password) {
    response.status(400).json({ error: "Email and password are required." });
    return;
  }
  if (password.length < 6) {
    response.status(400).json({ error: "Password must be at least 6 characters." });
    return;
  }

  const created = await createEmailPasswordUserViaFirebase({
    email,
    password,
    displayName: name || undefined,
  });

  const profile = await upsertAdminProfileByUid(created.uid, {
    email,
    name: name || created.displayName || email,
    role: "regular",
    active: true,
    createdBy: session.uid,
  });

  response.status(201).json({
    success: true,
    user: {
      uid: created.uid,
      email: created.email || email,
      displayName: created.displayName || name || "",
    },
    profile,
  });
};

const fetchCourseCatalogHandler: express.RequestHandler = async (_request, response) => {
  const catalog = await fetchCourseCatalogFromDb();
  response.status(200).json(catalog);
};

const uploadCourseCatalogHandler: express.RequestHandler = async (request, response) => {
  if (!assertMethod(request, response, "POST")) return;
  await uploadCourseCatalogToDb(getBody(request));
  response.status(200).json({ success: true });
};

const upsertSingleCourseHandler: express.RequestHandler = async (request, response) => {
  if (!assertMethod(request, response, "POST")) return;
  const body = getBody(request);
  const course = await upsertSingleCourseCatalogEntryInDb({
    cluster: Number(body?.cluster),
    name: String(body?.name || ""),
    requirements: body?.requirements || {},
    universities: Array.isArray(body?.universities) ? body.universities : [],
  });
  response.status(200).json(course);
};

const saveClusterSessionHandler: express.RequestHandler = async (request, response) => {
  if (!assertMethod(request, response, "POST")) return;
  const body = getBody(request);
  const session = await saveClusterSessionInDb({
    code: body?.code,
    email: String(body?.email || ""),
    phoneNumber: String(body?.phoneNumber || ""),
    amountPaid: Number(body?.amountPaid ?? 0),
    grades: body?.grades || {},
    results: body?.results || {},
    medicineEligible: Boolean(body?.medicineEligible),
    paymentResponse: body?.paymentResponse || null,
  });
  response.status(201).json(session);
};

const fetchClusterSessionByCodeHandler: express.RequestHandler = async (request, response) => {
  const code = String(request.params?.code || "").trim();
  const session = await fetchClusterSessionByCodeFromDb(code);
  if (!session) {
    response.status(404).json({ error: "Session not found." });
    return;
  }
  response.status(200).json(session);
};

const fetchAllClusterSessionsHandler: express.RequestHandler = async (_request, response) => {
  const sessions = await fetchAllClusterSessionsFromDb();
  response.status(200).json(sessions);
};

const updateClusterSessionHandler: express.RequestHandler = async (request, response) => {
  const code = String(request.params?.code || "").trim();
  await updateClusterSessionByCodeInDb(code, getBody(request));
  response.status(200).json({ success: true });
};

const deleteClusterSessionHandler: express.RequestHandler = async (request, response) => {
  const code = String(request.params?.code || "").trim();
  await deleteClusterSessionByCodeInDb(code);
  response.status(200).json({ success: true });
};

const deleteClusterSessionsBulkHandler: express.RequestHandler = async (request, response) => {
  if (!assertMethod(request, response, "POST")) return;
  const body = getBody(request);
  const count = await deleteClusterSessionsByCodesInDb(Array.isArray(body?.codes) ? body.codes : []);
  response.status(200).json({ success: true, deleted: count });
};

const apiPaymentsCreateHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("apiPaymentsCreate", request);
  if (!assertMethod(request, response, "POST")) return;

  const body = getBody(request);
  const phone =
    body?.phone_number || body?.phoneNumber || body?.phone || body?.["phone number"] || body?.phone_number || "";
  const amount = Number(body?.amount ?? 0);
  const accountReference = String(body?.account_reference || body?.accountReference || "KUCCPS-CLUSTER");
  const transactionDesc = String(body?.transaction_description || body?.transactionDesc || "Cluster payment");

  const result = await requestStkPush({
    phone,
    amount,
    accountReference,
    transactionDesc,
  });

  const paymentSession = upsertPaymentSession({
    checkoutRequestId: result?.CheckoutRequestID,
    merchantRequestId: result?.MerchantRequestID,
    phone,
    amount,
    status: "pending",
    responseDescription: result?.ResponseDescription,
    customerMessage: result?.CustomerMessage,
    initiationResponse: result,
  });

  response.status(201).json({
    success: true,
    data: {
      ...result,
      checkoutRequestId: result?.CheckoutRequestID || "",
      merchantRequestId: result?.MerchantRequestID || "",
      status: paymentSession?.status || "pending",
      payment: paymentSession || null,
    },
  });
};

const apiPaymentsQueryHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("apiPaymentsQuery", request);
  if (!assertMethod(request, response, "POST")) return;

  const body = getBody(request);
  const checkoutRequestId = normalizeRequestIdentifier(body?.checkoutRequestId || body?.CheckoutRequestID);
  if (!checkoutRequestId) {
    response.status(400).json({ success: false, error: "checkoutRequestId is required." });
    return;
  }

  let queryResponse: any;
  try {
    queryResponse = await queryStkPushStatus({ checkoutRequestId });
  } catch (error: any) {
    const message = String(error?.message || "").trim();
    const statusCode = Number(error?.statusCode || 0);
    const existingSession = getPaymentSession({ checkoutRequestId });
    const fallbackMerchantRequestId = existingSession?.merchantRequestId || "";
    const fallbackPhone = existingSession?.phone || "";
    const fallbackAmount = existingSession?.amount || 0;
    const fallbackCallbackPayload = existingSession?.callbackPayload || {};
    const missingTransaction = /transaction\s+does\s+not\s+exist/i.test(message);
    const transientDarajaError =
      statusCode >= 500 || /temporarily unavailable|timeout|timed out|service unavailable|internal/i.test(message);

    if (existingSession) {
      response.status(200).json({
        success: true,
        data: {
          ...existingSession,
          status: existingSession.status,
          warning: message || "Payment status provider is temporarily unavailable.",
        },
      });
      return;
    }

    if (!missingTransaction && !transientDarajaError) throw error;

    const paymentSession = upsertPaymentSession({
      checkoutRequestId,
      merchantRequestId: fallbackMerchantRequestId,
      phone: fallbackPhone,
      amount: fallbackAmount,
      status: "pending",
      resultDesc: message || "Transaction is not yet available for query.",
      callbackPayload: {
        ...fallbackCallbackPayload,
        queryResponse: {
          ResultCode: 1037,
          ResultDesc: message || "Transaction is not yet available for query.",
          CheckoutRequestID: checkoutRequestId,
        },
      },
    });

    response.status(200).json({
      success: true,
      data: {
        ...(paymentSession || {}),
        status: "pending",
        queryResponse: {
          ResultCode: 1037,
          ResultDesc: message || "Transaction is not yet available for query.",
          CheckoutRequestID: checkoutRequestId,
        },
      },
    });
    return;
  }

  const resultCode = Number(queryResponse?.ResultCode ?? NaN);
  const resultDesc = String(queryResponse?.ResultDesc || "").trim();
  const normalizedStatus = mapDarajaResultCodeToStatus(resultCode);

  const existingSession = getPaymentSession({ checkoutRequestId });
  const paymentSession = upsertPaymentSession({
    checkoutRequestId,
    merchantRequestId: existingSession?.merchantRequestId || queryResponse?.MerchantRequestID || "",
    phone: existingSession?.phone || "",
    amount: existingSession?.amount || 0,
    status: normalizedStatus,
    resultCode: Number.isFinite(resultCode) ? resultCode : null,
    resultDesc,
    callbackPayload: {
      ...(existingSession?.callbackPayload || {}),
      queryResponse,
    },
  });

  response.status(200).json({
    success: true,
    data: {
      ...(paymentSession || {}),
      queryResponse,
      status: paymentSession?.status || normalizedStatus,
    },
  });
};

const apiPaymentsCallbackHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("apiPaymentsCallback", request);
  const callback = parseDarajaCallback(request.body || {});
  upsertPaymentSession({
    checkoutRequestId: callback.checkoutRequestId,
    merchantRequestId: callback.merchantRequestId,
    phone: callback.metadata?.PhoneNumber || "",
    amount: callback.metadata?.Amount ?? 0,
    status: callback.resultCode === 0 ? "success" : "failed",
    resultCode: callback.resultCode,
    resultDesc: callback.resultDesc,
    callbackMetadata: callback.metadata,
    callbackPayload: request.body || null,
  });

  response.status(200).json({
    ResultCode: 0,
    ResultDesc: "Success",
  });
};

const apiPaymentsValidationHandler: express.RequestHandler = async (_request, response) => {
  response.status(200).json({
    ResultCode: 0,
    ResultDesc: "Validation passed",
  });
};

const stkPushHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("stkPush", request);

  if (request.method === "GET") {
    response.status(200).json({
      status: "ready",
      route: "/stkPush",
      method: "POST",
      requiredBody: ["phone number|phone_number|phoneNumber|phone", "amount"],
      callbacks: {
        active: getDarajaCallbackUrl() || "",
        local: getEnv("MPESA_CALLBACK_URL_LOCAL"),
        firebase: getEnv("MPESA_CALLBACK_URL_FIREBASE"),
      },
      note: "Submit JSON in POST body to initiate STK push.",
    });
    return;
  }

  if (!assertMethod(request, response, "POST")) return;

  try {
    const body = getBody(request);
    const phone =
      body["phone number"] || body.phone_number || body.phoneNumber || body.phone || "";
    const amount = body.amount;
    const accountReference = body.accountReference;
    const transactionDesc = body.transactionDesc;

    const result = await requestStkPush({ phone, amount, accountReference, transactionDesc });
    const paymentSession = upsertPaymentSession({
      checkoutRequestId: result?.CheckoutRequestID,
      merchantRequestId: result?.MerchantRequestID,
      phone,
      amount,
      status: "pending",
      responseDescription: result?.ResponseDescription,
      customerMessage: result?.CustomerMessage,
      initiationResponse: result,
    });
    logLocal("info", "STK push request queued", {
      requestId: (request as any).requestId || "",
      phone: truncate(phone, 32),
      amount,
      checkoutRequestId: result?.CheckoutRequestID || "",
      merchantRequestId: result?.MerchantRequestID || "",
    });
    response.status(200).json({
      status: "queued",
      paymentStatus: paymentSession?.status || "pending",
      ...result,
    });
  } catch (error: any) {
    const statusCode = Number(error?.statusCode || 500);
    logger.error("stkPush failed", {
      message: error?.message || "Unknown STK push error.",
      statusCode,
    });
    response.status(statusCode).json({
      error: error?.message || "Daraja STK push request failed.",
    });
  }
};

const darajaCallbackHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("darajaCallback", request);

  if (request.method !== "POST") {
    response.status(200).json({ status: "ok" });
    return;
  }

  logger.info("Daraja callback received", {
    body: request.body || null,
  });

  const callback = parseDarajaCallback(request.body || {});
  upsertPaymentSession({
    checkoutRequestId: callback.checkoutRequestId,
    merchantRequestId: callback.merchantRequestId,
    phone: callback.metadata?.PhoneNumber || "",
    amount: callback.metadata?.Amount ?? 0,
    status: callback.resultCode === 0 ? "success" : "failed",
    resultCode: callback.resultCode,
    resultDesc: callback.resultDesc,
    callbackMetadata: callback.metadata,
    callbackPayload: request.body || null,
  });

  response.status(200).json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
};

const paymentStatusHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("paymentStatus", request);

  if (request.method === "GET" && !request.query?.checkoutRequestId && !request.query?.merchantRequestId) {
    response.status(200).json({
      status: "ready",
      route: "/paymentStatus",
      methods: ["GET", "POST"],
      requiredIdentifier: ["checkoutRequestId", "merchantRequestId"],
      note: "Supply either checkoutRequestId or merchantRequestId to inspect a payment session.",
    });
    return;
  }

  if (!["GET", "POST"].includes(request.method)) {
    response.status(405).json({ error: `Method ${request.method} is not allowed. Use GET or POST.` });
    return;
  }

  const input: any = request.method === "GET" ? request.query || {} : getBody(request);
  const checkoutRequestId = input.checkoutRequestId || input.CheckoutRequestID;
  const merchantRequestId = input.merchantRequestId || input.MerchantRequestID;
  const paymentSession = getPaymentSession({ checkoutRequestId, merchantRequestId });

  if (!paymentSession) {
    response.status(404).json({ error: "Payment session not found." });
    return;
  }

  response.status(200).json(paymentSession);
};

const resolvePaymentSessionForCalculation = async ({
  checkoutRequestId,
  merchantRequestId,
}: {
  checkoutRequestId?: string;
  merchantRequestId?: string;
}): Promise<PaymentSession | null> => {
  const normalizedCheckoutRequestId = normalizeRequestIdentifier(checkoutRequestId);
  const normalizedMerchantRequestId = normalizeRequestIdentifier(merchantRequestId);
  const existingSession = getPaymentSession({
    checkoutRequestId: normalizedCheckoutRequestId,
    merchantRequestId: normalizedMerchantRequestId,
  });

  const resolvedCheckoutRequestId =
    normalizedCheckoutRequestId ||
    existingSession?.checkoutRequestId ||
    resolveCheckoutRequestId({
      checkoutRequestId: normalizedCheckoutRequestId,
      merchantRequestId: normalizedMerchantRequestId || existingSession?.merchantRequestId,
    });

  if (!resolvedCheckoutRequestId) return existingSession || null;

  try {
    const queryResponse = await queryStkPushStatus({ checkoutRequestId: resolvedCheckoutRequestId });
    const resultCode = Number(queryResponse?.ResultCode ?? NaN);
    const resultDesc = String(queryResponse?.ResultDesc || "").trim();
    const status = mapDarajaResultCodeToStatus(resultCode);

    return upsertPaymentSession({
      checkoutRequestId: resolvedCheckoutRequestId,
      merchantRequestId:
        normalizedMerchantRequestId || existingSession?.merchantRequestId || queryResponse?.MerchantRequestID || "",
      phone: existingSession?.phone || "",
      amount: existingSession?.amount || 0,
      status,
      resultCode: Number.isFinite(resultCode) ? resultCode : null,
      resultDesc,
      callbackPayload: {
        ...(existingSession?.callbackPayload || {}),
        queryResponse,
      },
    });
  } catch (error: any) {
    const message = String(error?.message || "").trim();
    const statusCode = Number(error?.statusCode || 0);
    const missingTransaction = /transaction\s+does\s+not\s+exist/i.test(message);
    const transientDarajaError =
      statusCode >= 500 || /temporarily unavailable|timeout|timed out|service unavailable|internal/i.test(message);
    if (!missingTransaction && !transientDarajaError) throw error;

    if (existingSession?.status === "success") {
      return existingSession;
    }

    return upsertPaymentSession({
      checkoutRequestId: resolvedCheckoutRequestId,
      merchantRequestId: normalizedMerchantRequestId || existingSession?.merchantRequestId || "",
      phone: existingSession?.phone || "",
      amount: existingSession?.amount || 0,
      status: "pending",
      resultDesc: message || "Transaction is not yet available for query.",
      callbackPayload: {
        ...(existingSession?.callbackPayload || {}),
        queryResponse: {
          ResultCode: 1037,
          ResultDesc: message || "Transaction is not yet available for query.",
          CheckoutRequestID: resolvedCheckoutRequestId,
        },
      },
    });
  }
};

const calculateClusterPointsHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("calculateClusterPoints", request);

  if (request.method === "GET") {
    response.status(200).json({
      status: "ready",
      route: "/calculateClusterPoints",
      method: "POST",
      requiredBody: ["grades", "checkoutRequestId|merchantRequestId"],
      note: "The referenced payment must already be marked successful before calculation is allowed.",
    });
    return;
  }

  if (!assertMethod(request, response, "POST")) return;

  try {
    const body = getBody(request);
    const paymentSession = await resolvePaymentSessionForCalculation({
      checkoutRequestId: body.checkoutRequestId || body.CheckoutRequestID,
      merchantRequestId: body.merchantRequestId || body.MerchantRequestID,
    });

    if (!paymentSession) {
      response.status(404).json({ error: "Payment session not found." });
      return;
    }

    if (paymentSession.status !== "success") {
      const isPending = paymentSession.status === "pending";
      response.status(isPending ? 409 : 402).json({
        error: isPending
          ? "Payment confirmation is still pending."
          : paymentSession.resultDesc || "Payment failed, so calculation is not allowed.",
        paymentStatus: paymentSession.status,
        checkoutRequestId: paymentSession.checkoutRequestId,
        merchantRequestId: paymentSession.merchantRequestId,
      });
      return;
    }

    const calculated = await calculateClusterResults(body.grades || {});
    response.status(200).json({
      status: "calculated",
      paymentStatus: paymentSession.status,
      checkoutRequestId: paymentSession.checkoutRequestId,
      merchantRequestId: paymentSession.merchantRequestId,
      ...calculated,
    });
  } catch (error: any) {
    const statusCode = Number(error?.statusCode || 400);
    response.status(statusCode).json({
      error: error?.message || "Cluster calculation failed.",
    });
  }
};

const sendEmailHandler: express.RequestHandler = async (request, response) => {
  logHandlerAccess("sendEmail", request);

  if (request.method === "GET") {
    response.status(200).json({
      status: "ready",
      route: "/sendEmail",
      method: "POST",
      requiredBody: ["email", "subject", "message"],
      note: "Submit JSON in POST body to send email.",
    });
    return;
  }

  if (!assertMethod(request, response, "POST")) return;

  try {
    const body = getBody(request);
    const query = request.query || {};
    const to = sanitizeHeaderValue(body.email ?? query.email);
    const subject = sanitizeHeaderValue(body.subject ?? query.subject);
    const message = String(body.message ?? query.message ?? "");

    if (!to || !subject || !message) {
      response.status(400).json({ error: "email, subject, and message are required." });
      return;
    }

    const hostUser = requireEnv("EMAIL_HOST_USER");
    const from = sanitizeHeaderValue(getEnv("EMAIL_FROM", hostUser));
    const transport = getEmailTransport();
    const info = await transport.sendMail({
      from,
      to,
      subject,
      text: message,
    });

    response.status(200).json({
      status: "sent",
      messageId: info.messageId,
      accepted: info.accepted || [],
      rejected: info.rejected || [],
    });
  } catch (error: any) {
    const statusCode = Number(error?.statusCode || 500);
    logger.error("sendEmail failed", {
      message: error?.message || "Unknown email error.",
      statusCode,
    });
    response.status(statusCode).json({
      error: error?.message || "Email delivery failed.",
    });
  }
};

const logHandlerAccess = (handlerName: string, request: express.Request & { requestId?: string }) => {
  const requestId = ensureRequestId(request);
  logLocal("info", "Handler accessed", {
    requestId,
    handler: handlerName,
    method: request.method,
    path: getRequestPath(request),
    body: summarizeBody(getBody(request)),
  });
};

const createBackendServer = () => {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", true);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use((request: express.Request & { requestId?: string }, response, next) => {
    request.requestId = ensureRequestId(request);
    const startedAt = Date.now();

    logLocal("info", "Incoming request", {
      requestId: request.requestId,
      method: request.method,
      path: getRequestPath(request),
      ip: request.ip || request.socket?.remoteAddress || "",
      userAgent: truncate(request.headers["user-agent"] || "", 180),
      contentType: request.headers["content-type"] || "",
    });

    response.on("finish", () => {
      logLocal("info", "Request completed", {
        requestId: request.requestId,
        method: request.method,
        path: getRequestPath(request),
        status: response.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    next();
  });

  app.use((request, response, next) => {
    const requestOrigin = normalizeOrigin(request.headers.origin || "");
    let allowOrigin = "";

    if (allowAnyCorsOrigin) {
      allowOrigin = requestOrigin || "*";
    } else if (requestOrigin && corsOrigins.includes(requestOrigin)) {
      allowOrigin = requestOrigin;
    } else if (corsOrigins.length > 0) {
      allowOrigin = corsOrigins[0];
    }

    if (allowOrigin) {
      response.set("Access-Control-Allow-Origin", allowOrigin);
    }
    response.set("Vary", "Origin");
    response.set("Access-Control-Allow-Credentials", "true");
    response.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    next();
  });

  app.get("/admin/health", requireAdminSession, withAsyncGuard("adminHealthLegacy", adminHealthHandler));
  app.get("/api/admin/health", requireAdminSession, withAsyncGuard("adminHealth", adminHealthHandler));

  app.get("/health", (request, response) => {
    response.status(200).json({
      status: "ok",
      service: "kuccps-cluster-backend-server",
      trackedPayments: paymentSessionsByCheckoutId.size,
    });
  });

  app.get("/api", (request, response) => {
    response.status(200).json({
      status: "ok",
      service: "kuccps-cluster-backend-server",
      endpoints: [
        "/stkPush",
        "/api/payments",
        "/api/payments/query",
        "/api/payments/callback",
        "/callback",
        "/darajaCallback",
        "/paymentStatus",
        "/calculateClusterPoints",
        "/sendEmail",
        "/api/sendEmail",
        "/api/catalog",
        "/api/sessions/:code",
        "/api/admin/login",
        "/api/admin/me",
        "/health",
      ],
    });
  });

  app.get("/api/config/public", withAsyncGuard("publicConfig", publicConfigHandler));
  app.post("/api/admin/login", withAsyncGuard("adminLogin", adminLoginHandler));
  app.post("/api/admin/logout", withAsyncGuard("adminLogout", adminLogoutHandler));
  app.get("/api/admin/me", requireAdminSession, withAsyncGuard("adminMe", adminMeHandler));
  app.post("/api/admin/regular-admin", requireAdminSession, withAsyncGuard("addRegularAdmin", addRegularAdminHandler));

  app.get("/api/catalog", withAsyncGuard("fetchCourseCatalog", fetchCourseCatalogHandler));
  app.post(
    "/api/admin/catalog/upload",
    requireAdminSession,
    withAsyncGuard("uploadCourseCatalog", uploadCourseCatalogHandler),
  );
  app.post(
    "/api/admin/catalog/course",
    requireAdminSession,
    withAsyncGuard("upsertSingleCourse", upsertSingleCourseHandler),
  );

  app.post("/api/sessions", withAsyncGuard("saveClusterSession", saveClusterSessionHandler));
  app.get("/api/sessions/:code", withAsyncGuard("fetchClusterSessionByCode", fetchClusterSessionByCodeHandler));
  app.get("/api/admin/sessions", requireAdminSession, withAsyncGuard("fetchAllSessions", fetchAllClusterSessionsHandler));
  app.patch(
    "/api/admin/sessions/:code",
    requireAdminSession,
    withAsyncGuard("updateClusterSession", updateClusterSessionHandler),
  );
  app.delete(
    "/api/admin/sessions/:code",
    requireAdminSession,
    withAsyncGuard("deleteClusterSession", deleteClusterSessionHandler),
  );
  app.post(
    "/api/admin/sessions/delete-many",
    requireAdminSession,
    withAsyncGuard("deleteClusterSessionsBulk", deleteClusterSessionsBulkHandler),
  );

  app.post("/api/payments", withAsyncGuard("apiPaymentsCreate", apiPaymentsCreateHandler));
  app.post("/api/payments/query", withAsyncGuard("apiPaymentsQuery", apiPaymentsQueryHandler));
  app.post("/api/payments/callback", withAsyncGuard("apiPaymentsCallback", apiPaymentsCallbackHandler));
  app.get("/api/payments/validation", withAsyncGuard("apiPaymentsValidation", apiPaymentsValidationHandler));

  app.get("/config/firebase", withAsyncGuard("firebaseConfig", firebaseConfigHandler));
  app.all("/stkPush", withAsyncGuard("stkPush", stkPushHandler));
  app.all("/callback", withAsyncGuard("callback", darajaCallbackHandler));
  app.all("/darajaCallback", withAsyncGuard("darajaCallback", darajaCallbackHandler));
  app.all("/paymentStatus", withAsyncGuard("paymentStatus", paymentStatusHandler));
  app.all("/calculateClusterPoints", withAsyncGuard("calculateClusterPoints", calculateClusterPointsHandler));
  app.all("/sendEmail", withAsyncGuard("sendEmail", sendEmailHandler));
  app.all("/api/sendEmail", withAsyncGuard("sendEmailApi", sendEmailHandler));

  // Serve React build (Vite) when available.
  const frontendDistCandidates = [
    path.resolve(__dirname, "..", "frontend", "dist"),
    path.resolve(__dirname, "..", "..", "frontend", "dist"),
    path.resolve(process.cwd(), "frontend", "dist"),
    path.resolve(__dirname, "..", "dist"),
    path.resolve(process.cwd(), "dist"),
  ];

  const distPath = frontendDistCandidates.find((candidatePath) =>
    fs.existsSync(path.join(candidatePath, "index.html")),
  );
  const indexHtmlPath = distPath ? path.join(distPath, "index.html") : "";
  if (distPath && indexHtmlPath) {
    app.use(express.static(distPath));

    // SPA fallback – must come AFTER API routes but BEFORE the 404 handler.
    app.get("*", (request, response, next) => {
      // Avoid intercepting API/utility routes that don't expect HTML.
      if (
        request.path.startsWith("/api/") ||
        request.path.startsWith("/stkPush") ||
        request.path.startsWith("/callback") ||
        request.path.startsWith("/darajaCallback") ||
        request.path.startsWith("/paymentStatus") ||
        request.path.startsWith("/calculateClusterPoints") ||
        request.path.startsWith("/sendEmail") ||
        request.path.startsWith("/health")
      ) {
        return next();
      }

      response.sendFile(indexHtmlPath, (error) => {
        if (error) next(error);
      });
    });
  }

  app.use(
    (
      error: any,
      request: express.Request & { requestId?: string },
      response: express.Response,
      next: express.NextFunction,
    ) => {
    logger.error("Unhandled express error", {
      requestId: request.requestId || "",
      method: request.method,
      path: request.originalUrl || request.url,
      body: summarizeBody(getBody(request)),
      ...safeErrorObject(error),
    });

    if (response.headersSent) {
      next(error);
      return;
    }

    const statusCode =
      Number(error?.statusCode || error?.status || 500) >= 400
        ? Number(error?.statusCode || error?.status || 500)
        : 500;

    response.status(statusCode).json({
      error: error?.message || "Internal server error.",
      requestId: request.requestId || "",
    });
    },
  );

  app.use((request, response) => {
    response.status(404).json({ error: "Not found." });
  });

  return app;
};

const startLocalServer = async ({
  app,
  requestedPort,
  retries,
  host,
}: {
  app: express.Express;
  requestedPort: number;
  retries: number;
  host: string;
}) =>
  new Promise<{ server: any; port: number }>((resolve, reject) => {
    const tryListen = (port: number, remainingRetries: number) => {
      const server = app.listen(port, host, () => {
        resolve({ server, port });
      });

      server.once("error", (error: any) => {
        if (error?.code === "EADDRINUSE" && remainingRetries > 0) {
          logger.warn("Local port is in use, trying next port.", {
            attemptedPort: port,
            nextPort: port + 1,
          });
          tryListen(port + 1, remainingRetries - 1);
          return;
        }

        reject(error);
      });
    };

    tryListen(requestedPort, retries);
  });

if (require.main === module) {
  const port = Number(getEnv("PORT", "5001")) || 5001;
  const host = getEnv("HOST", "0.0.0.0") || "0.0.0.0";
  const retries = Number(getEnv("PORT_RETRIES", "20")) || 20;
  const app = createBackendServer();

  startLocalServer({ app, requestedPort: port, retries, host })
    .then(({ port: actualPort }) => {
      logger.info("Backend server started", {
        url: `http://${host}:${actualPort}`,
        railwayPort: getEnv("PORT", ""),
        railwayHost: getEnv("HOST", ""),
        requestedPort: port,
        endpoints: [
          "/stkPush",
          "/callback",
          "/darajaCallback",
          "/paymentStatus",
          "/calculateClusterPoints",
          "/sendEmail",
          "/health",
        ],
        callbackLocal: getEnv("MPESA_CALLBACK_URL_LOCAL") || "",
        callbackFirebase: getEnv("MPESA_CALLBACK_URL_FIREBASE") || "",
        callbackUrl: getEnv("MPESA_CALLBACK_URL") || "",
      });
    })
    .catch((error) => {
      logger.error("Failed to start backend server", {
        message: error?.message || "Unknown startup error.",
        code: error?.code || "UNKNOWN",
        requestedPort: port,
      });
      process.exitCode = 1;
    });
}

export {};
