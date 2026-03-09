const localSessionsStorageKey = "kuccps.cluster.sessions";

const apiRoutes = {
  catalog: "/api/catalog",
  adminCatalogUpload: "/api/admin/catalog/upload",
  adminCatalogCourse: "/api/admin/catalog/course",
  sessions: "/api/sessions",
  adminSessions: "/api/admin/sessions",
  adminSessionsBulkDelete: "/api/admin/sessions/delete-many",
  adminMe: "/api/admin/me",
};

type HttpResult<T = any> = {
  ok: boolean;
  status: number;
  data: T | null;
};

const parseResponseBody = async (response: Response): Promise<any | null> => {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getRequest = async (url: string): Promise<HttpResult> => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
};

const postRequest = async (url: string, payload: any): Promise<HttpResult> => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
};

const patchRequest = async (url: string, payload: any): Promise<HttpResult> => {
  const response = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
};

const deleteRequest = async (url: string): Promise<HttpResult> => {
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
};

const extractErrorMessage = (result: HttpResult, fallback: string): string => {
  const body: any = result?.data || {};
  return String(body?.error || body?.message || fallback);
};

const normalizeSessionCode = (code: string): string =>
  String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

const normalizeSessionResults = (value: any): Record<number, number> => {
  const raw = value && typeof value === "object" ? value : {};
  const normalized: Record<number, number> = {};
  for (let cluster = 1; cluster <= 20; cluster += 1) {
    const score = Number(raw[cluster] ?? raw[String(cluster)] ?? 0);
    normalized[cluster] = Number.isFinite(score) ? score : 0;
  }
  return normalized;
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

const getLocalSessionsMap = (): Record<string, ClusterSessionPayload> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(localSessionsStorageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const setLocalSessionsMap = (sessionsMap: Record<string, ClusterSessionPayload>): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(localSessionsStorageKey, JSON.stringify(sessionsMap || {}));
};

const accessCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generateAccessCode = (length = 8): string => {
  if (typeof crypto !== "undefined" && (crypto as Crypto).getRandomValues) {
    const bytes = new Uint8Array(length);
    (crypto as Crypto).getRandomValues(bytes);
    return Array.from(bytes, (byte) => accessCodeAlphabet[byte % accessCodeAlphabet.length]).join("");
  }

  let value = "";
  for (let index = 0; index < length; index += 1) {
    const random = Math.floor(Math.random() * accessCodeAlphabet.length);
    value += accessCodeAlphabet[random];
  }
  return value;
};

const createUniqueLocalCode = (): string => {
  const existing = getLocalSessionsMap();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = generateAccessCode();
    if (!existing[code]) return code;
  }
  throw new Error("Unable to generate a local access code.");
};

const saveLocalSession = (sessionPayload: ClusterSessionPayload): void => {
  const sessionsMap = getLocalSessionsMap();
  sessionsMap[sessionPayload.code] = sessionPayload;
  setLocalSessionsMap(sessionsMap);
};

const normalizeCourse = (rawCourse: any, fallbackName = ""): NormalizedCourse => ({
  name: rawCourse?.name || fallbackName,
  requirements: (rawCourse?.requirements || {}) as Record<string, string>,
  universities: Array.isArray(rawCourse?.universities)
    ? rawCourse.universities.map((entry: any) => ({
        name: String(entry?.name || ""),
        cutoff: Number(entry?.cutoff ?? 0),
        courseCode: String(entry?.courseCode || ""),
      }))
    : [],
});

const normalizeClusterValue = (clusterValue: any): NormalizedCourse[] => {
  const items = Array.isArray(clusterValue) ? clusterValue : Object.values(clusterValue || {});
  return items.map((entry) => normalizeCourse(entry)).filter((course) => Boolean(course.name));
};

export type NormalizedCourse = {
  name: string;
  requirements: Record<string, string>;
  universities: { name: string; cutoff: number; courseCode: string }[];
};

export type NormalizedCatalog = Record<number, NormalizedCourse[]>;

const normalizeCourseCatalog = (raw: any): NormalizedCatalog => {
  if (!raw || typeof raw !== "object") return {};
  const normalized: NormalizedCatalog = {};

  Object.entries(raw).forEach(([clusterKey, clusterValue]) => {
    const clusterNumber = Number(clusterKey);
    if (!Number.isInteger(clusterNumber) || clusterNumber < 1) return;
    normalized[clusterNumber] = normalizeClusterValue(clusterValue);
  });

  return normalized;
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

export type AdminProfile = {
  uid: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export const isFirebaseReady = () => true;

export const fetchCourseCatalog = async (): Promise<NormalizedCatalog> => {
  const result = await getRequest(apiRoutes.catalog);
  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to load course catalog from backend."));
  }
  return normalizeCourseCatalog(result.data || {});
};

export const uploadCourseCatalog = async (catalog: any): Promise<void> => {
  if (!catalog || typeof catalog !== "object") {
    throw new Error("Invalid course catalog payload.");
  }

  const result = await postRequest(apiRoutes.adminCatalogUpload, catalog);
  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to upload course catalog to backend."));
  }
};

export const upsertSingleCourseCatalogEntry = async ({
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
  const result = await postRequest(apiRoutes.adminCatalogCourse, {
    cluster,
    name,
    requirements,
    universities,
  });
  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to save course entry to backend."));
  }
  return (result.data || {}) as NormalizedCourse;
};

export const saveClusterSession = async ({
  email,
  phoneNumber,
  amountPaid,
  grades,
  results,
  medicineEligible,
  paymentResponse,
}: {
  email: string;
  phoneNumber: string;
  amountPaid: number;
  grades: Record<string, string>;
  results: Record<string, number>;
  medicineEligible: boolean;
  paymentResponse: any;
}): Promise<ClusterSessionPayload> => {
  const result = await postRequest(apiRoutes.sessions, {
    email,
    phoneNumber,
    amountPaid,
    grades,
    results,
    medicineEligible,
    paymentResponse,
  });
  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to save session to backend."));
  }

  const payload: any = result.data || {};
  return {
    code: normalizeSessionCode(payload.code),
    email: String(payload.email || "").trim(),
    phoneNumber: String(payload.phoneNumber || "").trim(),
    amountPaid: Number(payload.amountPaid ?? 0),
    grades: normalizeSessionGrades(payload.grades),
    results: normalizeSessionResults(payload.results),
    medicineEligible: Boolean(payload.medicineEligible),
    paymentResponse: payload.paymentResponse || null,
    createdAt: String(payload.createdAt || ""),
    updatedAt: String(payload.updatedAt || ""),
    storage: "firebase",
  };
};

export const saveClusterSessionWithFallback = async (payload: {
  email: string;
  phoneNumber: string;
  amountPaid: number;
  grades: Record<string, string>;
  results: Record<string, number>;
  medicineEligible: boolean;
  paymentResponse: any;
}): Promise<{ session: ClusterSessionPayload; storage: "firebase" | "local"; warning: string }> => {
  try {
    const session = await saveClusterSession(payload);
    return { session, storage: "firebase", warning: "" };
  } catch (error: any) {
    const timestamp = new Date().toISOString();
    const localCode = createUniqueLocalCode();
    const localSession: ClusterSessionPayload = {
      code: localCode,
      email: String(payload?.email || "").trim(),
      phoneNumber: String(payload?.phoneNumber || "").trim(),
      amountPaid: Number(payload?.amountPaid ?? 0),
      grades: payload?.grades || {},
      results: normalizeSessionResults(payload?.results || {}),
      medicineEligible: Boolean(payload?.medicineEligible),
      paymentResponse: payload?.paymentResponse || null,
      createdAt: timestamp,
      updatedAt: timestamp,
      storage: "local",
    };

    saveLocalSession(localSession);
    return {
      session: localSession,
      storage: "local",
      warning: error?.message || "Backend save failed. Session saved locally on this browser only.",
    };
  }
};

export const fetchClusterSessionByCode = async (code: string): Promise<ClusterSessionPayload | null> => {
  const normalizedCode = normalizeSessionCode(code);
  if (!normalizedCode) return null;

  const result = await getRequest(`${apiRoutes.sessions}/${normalizedCode}`);
  if (result.ok && result.data) {
    const value: any = result.data;
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
  }

  const local = getLocalSessionsMap()[normalizedCode];
  if (local) {
    return {
      code: normalizedCode,
      email: local.email || "",
      phoneNumber: local.phoneNumber || "",
      amountPaid: Number(local.amountPaid ?? 0),
      grades: local.grades || {},
      results: normalizeSessionResults(local.results || {}),
      medicineEligible: Boolean(local.medicineEligible),
      paymentResponse: local.paymentResponse || null,
      createdAt: local.createdAt || "",
      updatedAt: local.updatedAt || "",
      storage: "local",
    };
  }

  if (result.status !== 404) {
    throw new Error(extractErrorMessage(result, "Unable to load session from backend."));
  }
  return null;
};

export const fetchAllClusterSessions = async (): Promise<ClusterSessionPayload[]> => {
  const result = await getRequest(apiRoutes.adminSessions);
  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to load calculated sessions from backend."));
  }

  const rows = Array.isArray(result.data) ? result.data : [];
  return rows
    .map((payload: any) => ({
      code: normalizeSessionCode(payload.code),
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
    }))
    .filter((session) => session.code)
    .sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0));
};

export const updateClusterSessionByCode = async (code: string, patch: any = {}): Promise<void> => {
  const normalizedCode = normalizeSessionCode(code);
  if (!normalizedCode) throw new Error("Session code is required.");

  const result = await patchRequest(`${apiRoutes.adminSessions}/${normalizedCode}`, patch);
  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to update session."));
  }
};

export const deleteClusterSessionByCode = async (code: string): Promise<void> => {
  const normalizedCode = normalizeSessionCode(code);
  if (!normalizedCode) throw new Error("Session code is required.");

  const result = await deleteRequest(`${apiRoutes.adminSessions}/${normalizedCode}`);
  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to delete session."));
  }
};

export const deleteClusterSessionsByCodes = async (codes: string[] = []): Promise<number> => {
  const result = await postRequest(apiRoutes.adminSessionsBulkDelete, {
    codes: Array.isArray(codes) ? codes : [],
  });
  if (!result.ok) {
    throw new Error(extractErrorMessage(result, "Unable to delete selected sessions."));
  }
  return Number((result.data as any)?.deleted ?? 0);
};

export const fetchAdminProfile = async (uid: string): Promise<AdminProfile | null> => {
  const result = await getRequest(apiRoutes.adminMe);
  if (!result.ok) return null;
  const profile = (result.data as any)?.profile || null;
  if (!profile) return null;
  if (uid && String(profile.uid || "").trim() !== String(uid).trim()) return null;
  return profile as AdminProfile;
};

export const upsertAdminProfile = async (_uid: string, _patch: Partial<AdminProfile>): Promise<AdminProfile> => {
  throw new Error("Admin profiles are managed by the backend server.");
};
