"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertAdminProfile = exports.fetchAdminProfile = exports.deleteClusterSessionsByCodes = exports.deleteClusterSessionByCode = exports.updateClusterSessionByCode = exports.fetchAllClusterSessions = exports.fetchClusterSessionByCode = exports.saveClusterSessionWithFallback = exports.saveClusterSession = exports.upsertSingleCourseCatalogEntry = exports.uploadCourseCatalog = exports.fetchCourseCatalog = exports.isFirebaseReady = void 0;
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
const parseResponseBody = async (response) => {
    try {
        const text = await response.text();
        if (!text)
            return null;
        return JSON.parse(text);
    }
    catch {
        return null;
    }
};
const getRequest = async (url) => {
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
    });
    const data = await parseResponseBody(response);
    return { ok: response.ok, status: response.status, data };
};
const postRequest = async (url, payload) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {}),
    });
    const data = await parseResponseBody(response);
    return { ok: response.ok, status: response.status, data };
};
const patchRequest = async (url, payload) => {
    const response = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {}),
    });
    const data = await parseResponseBody(response);
    return { ok: response.ok, status: response.status, data };
};
const deleteRequest = async (url) => {
    const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await parseResponseBody(response);
    return { ok: response.ok, status: response.status, data };
};
const extractErrorMessage = (result, fallback) => {
    const body = result?.data || {};
    return String(body?.error || body?.message || fallback);
};
const normalizeSessionCode = (code) => String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
const normalizeSessionResults = (value) => {
    const raw = value && typeof value === "object" ? value : {};
    const normalized = {};
    for (let cluster = 1; cluster <= 20; cluster += 1) {
        const score = Number(raw[cluster] ?? raw[String(cluster)] ?? 0);
        normalized[cluster] = Number.isFinite(score) ? score : 0;
    }
    return normalized;
};
const normalizeSessionGrades = (value) => {
    if (!value || typeof value !== "object")
        return {};
    const normalized = {};
    Object.entries(value).forEach(([subject, grade]) => {
        const subjectCode = String(subject || "").trim().toUpperCase();
        const normalizedGrade = String(grade || "").trim().toUpperCase();
        if (!subjectCode || !normalizedGrade)
            return;
        normalized[subjectCode] = normalizedGrade;
    });
    return normalized;
};
const getLocalSessionsMap = () => {
    if (typeof window === "undefined")
        return {};
    try {
        const raw = window.localStorage.getItem(localSessionsStorageKey);
        if (!raw)
            return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    }
    catch {
        return {};
    }
};
const setLocalSessionsMap = (sessionsMap) => {
    if (typeof window === "undefined")
        return;
    window.localStorage.setItem(localSessionsStorageKey, JSON.stringify(sessionsMap || {}));
};
const accessCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generateAccessCode = (length = 8) => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        const bytes = new Uint8Array(length);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, (byte) => accessCodeAlphabet[byte % accessCodeAlphabet.length]).join("");
    }
    let value = "";
    for (let index = 0; index < length; index += 1) {
        const random = Math.floor(Math.random() * accessCodeAlphabet.length);
        value += accessCodeAlphabet[random];
    }
    return value;
};
const createUniqueLocalCode = () => {
    const existing = getLocalSessionsMap();
    for (let attempt = 0; attempt < 20; attempt += 1) {
        const code = generateAccessCode();
        if (!existing[code])
            return code;
    }
    throw new Error("Unable to generate a local access code.");
};
const saveLocalSession = (sessionPayload) => {
    const sessionsMap = getLocalSessionsMap();
    sessionsMap[sessionPayload.code] = sessionPayload;
    setLocalSessionsMap(sessionsMap);
};
const normalizeCourse = (rawCourse, fallbackName = "") => ({
    name: rawCourse?.name || fallbackName,
    requirements: (rawCourse?.requirements || {}),
    universities: Array.isArray(rawCourse?.universities)
        ? rawCourse.universities.map((entry) => ({
            name: String(entry?.name || ""),
            cutoff: Number(entry?.cutoff ?? 0),
            courseCode: String(entry?.courseCode || ""),
        }))
        : [],
});
const normalizeClusterValue = (clusterValue) => {
    const items = Array.isArray(clusterValue) ? clusterValue : Object.values(clusterValue || {});
    return items.map((entry) => normalizeCourse(entry)).filter((course) => Boolean(course.name));
};
const normalizeCourseCatalog = (raw) => {
    if (!raw || typeof raw !== "object")
        return {};
    const normalized = {};
    Object.entries(raw).forEach(([clusterKey, clusterValue]) => {
        const clusterNumber = Number(clusterKey);
        if (!Number.isInteger(clusterNumber) || clusterNumber < 1)
            return;
        normalized[clusterNumber] = normalizeClusterValue(clusterValue);
    });
    return normalized;
};
const isFirebaseReady = () => true;
exports.isFirebaseReady = isFirebaseReady;
const fetchCourseCatalog = async () => {
    const result = await getRequest(apiRoutes.catalog);
    if (!result.ok) {
        throw new Error(extractErrorMessage(result, "Unable to load course catalog from backend."));
    }
    return normalizeCourseCatalog(result.data || {});
};
exports.fetchCourseCatalog = fetchCourseCatalog;
const uploadCourseCatalog = async (catalog) => {
    if (!catalog || typeof catalog !== "object") {
        throw new Error("Invalid course catalog payload.");
    }
    const result = await postRequest(apiRoutes.adminCatalogUpload, catalog);
    if (!result.ok) {
        throw new Error(extractErrorMessage(result, "Unable to upload course catalog to backend."));
    }
};
exports.uploadCourseCatalog = uploadCourseCatalog;
const upsertSingleCourseCatalogEntry = async ({ cluster, name, requirements, universities, }) => {
    const result = await postRequest(apiRoutes.adminCatalogCourse, {
        cluster,
        name,
        requirements,
        universities,
    });
    if (!result.ok) {
        throw new Error(extractErrorMessage(result, "Unable to save course entry to backend."));
    }
    return (result.data || {});
};
exports.upsertSingleCourseCatalogEntry = upsertSingleCourseCatalogEntry;
const saveClusterSession = async ({ email, phoneNumber, amountPaid, grades, results, medicineEligible, paymentResponse, }) => {
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
    const payload = result.data || {};
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
exports.saveClusterSession = saveClusterSession;
const saveClusterSessionWithFallback = async (payload) => {
    try {
        const session = await (0, exports.saveClusterSession)(payload);
        return { session, storage: "firebase", warning: "" };
    }
    catch (error) {
        const timestamp = new Date().toISOString();
        const localCode = createUniqueLocalCode();
        const localSession = {
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
exports.saveClusterSessionWithFallback = saveClusterSessionWithFallback;
const fetchClusterSessionByCode = async (code) => {
    const normalizedCode = normalizeSessionCode(code);
    if (!normalizedCode)
        return null;
    const result = await getRequest(`${apiRoutes.sessions}/${normalizedCode}`);
    if (result.ok && result.data) {
        const value = result.data;
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
exports.fetchClusterSessionByCode = fetchClusterSessionByCode;
const fetchAllClusterSessions = async () => {
    const result = await getRequest(apiRoutes.adminSessions);
    if (!result.ok) {
        throw new Error(extractErrorMessage(result, "Unable to load calculated sessions from backend."));
    }
    const rows = Array.isArray(result.data) ? result.data : [];
    return rows
        .map((payload) => ({
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
        storage: "firebase",
    }))
        .filter((session) => session.code)
        .sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0));
};
exports.fetchAllClusterSessions = fetchAllClusterSessions;
const updateClusterSessionByCode = async (code, patch = {}) => {
    const normalizedCode = normalizeSessionCode(code);
    if (!normalizedCode)
        throw new Error("Session code is required.");
    const result = await patchRequest(`${apiRoutes.adminSessions}/${normalizedCode}`, patch);
    if (!result.ok) {
        throw new Error(extractErrorMessage(result, "Unable to update session."));
    }
};
exports.updateClusterSessionByCode = updateClusterSessionByCode;
const deleteClusterSessionByCode = async (code) => {
    const normalizedCode = normalizeSessionCode(code);
    if (!normalizedCode)
        throw new Error("Session code is required.");
    const result = await deleteRequest(`${apiRoutes.adminSessions}/${normalizedCode}`);
    if (!result.ok) {
        throw new Error(extractErrorMessage(result, "Unable to delete session."));
    }
};
exports.deleteClusterSessionByCode = deleteClusterSessionByCode;
const deleteClusterSessionsByCodes = async (codes = []) => {
    const result = await postRequest(apiRoutes.adminSessionsBulkDelete, {
        codes: Array.isArray(codes) ? codes : [],
    });
    if (!result.ok) {
        throw new Error(extractErrorMessage(result, "Unable to delete selected sessions."));
    }
    return Number(result.data?.deleted ?? 0);
};
exports.deleteClusterSessionsByCodes = deleteClusterSessionsByCodes;
const fetchAdminProfile = async (uid) => {
    const result = await getRequest(apiRoutes.adminMe);
    if (!result.ok)
        return null;
    const profile = result.data?.profile || null;
    if (!profile)
        return null;
    if (uid && String(profile.uid || "").trim() !== String(uid).trim())
        return null;
    return profile;
};
exports.fetchAdminProfile = fetchAdminProfile;
const upsertAdminProfile = async (_uid, _patch) => {
    throw new Error("Admin profiles are managed by the backend server.");
};
exports.upsertAdminProfile = upsertAdminProfile;
