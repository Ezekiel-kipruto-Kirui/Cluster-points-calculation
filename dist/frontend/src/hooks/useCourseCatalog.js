"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCourseCatalog = void 0;
const react_1 = require("react");
const realtimeDb_1 = require("../lib/realtimeDb");
const courseCsv_1 = require("../lib/courseCsv");
const courses_csv_raw_1 = __importDefault(require("../courses.csv?raw"));
const normalizeCsvRequirements = (value) => {
    if (!Array.isArray(value))
        return {};
    const mapped = {};
    value.forEach((entry) => {
        const subject = String(entry?.subject || "").trim();
        const grade = String(entry?.grade || "").trim().toUpperCase();
        if (!subject || !grade)
            return;
        mapped[subject] = grade;
    });
    return mapped;
};
const normalizeCsvCatalog = (value) => {
    if (!value || typeof value !== "object")
        return {};
    const normalized = {};
    Object.entries(value).forEach(([clusterKey, clusterCourses]) => {
        const cluster = Number(clusterKey);
        if (!Number.isInteger(cluster) || cluster < 1)
            return;
        const rows = Array.isArray(clusterCourses) ? clusterCourses : [];
        normalized[cluster] = rows
            .map((course) => ({
            name: String(course?.name || "").trim(),
            requirements: normalizeCsvRequirements(course?.requirements),
            universities: Array.isArray(course?.universities)
                ? course.universities
                    .map((university) => ({
                    name: String(university?.name || "").trim(),
                    courseCode: String(university?.courseCode || "").trim(),
                    cutoff: Number(university?.cutoff ?? 0),
                }))
                    .filter((entry) => Boolean(entry.name))
                : [],
        }))
            .filter((course) => Boolean(course.name));
    });
    return normalized;
};
let bundledCatalogCache = null;
const getBundledCatalog = () => {
    if (bundledCatalogCache)
        return bundledCatalogCache;
    const parsed = (0, courseCsv_1.parseCourseCsvToCatalog)(courses_csv_raw_1.default);
    bundledCatalogCache = normalizeCsvCatalog(parsed);
    return bundledCatalogCache;
};
const useCourseCatalog = ({ mode = "public" } = {}) => {
    const [courseCatalog, setCourseCatalog] = (0, react_1.useState)({});
    const [catalogLoading, setCatalogLoading] = (0, react_1.useState)(true);
    const [courseCatalogError, setCourseCatalogError] = (0, react_1.useState)("");
    const loadCatalog = (0, react_1.useCallback)(async () => {
        setCatalogLoading(true);
        if (mode !== "admin") {
            try {
                const bundledCatalog = getBundledCatalog();
                setCourseCatalog(bundledCatalog);
                setCourseCatalogError("");
            }
            catch (error) {
                setCourseCatalog({});
                setCourseCatalogError(error?.message || "Unable to load bundled course catalog.");
            }
            finally {
                setCatalogLoading(false);
            }
            return;
        }
        try {
            const catalog = await (0, realtimeDb_1.fetchCourseCatalog)();
            setCourseCatalog(catalog);
            setCourseCatalogError("");
        }
        catch (error) {
            const bundledFallback = getBundledCatalog();
            setCourseCatalog(bundledFallback);
            const message = error?.message || "Unable to load courses from realtime database.";
            setCourseCatalogError(`${message} Showing bundled courses until backend connection is available.`);
        }
        finally {
            setCatalogLoading(false);
        }
    }, [mode]);
    const saveCatalog = (0, react_1.useCallback)(async (catalog) => {
        if (mode !== "admin") {
            throw new Error("Catalog updates are only available in admin mode.");
        }
        await (0, realtimeDb_1.uploadCourseCatalog)(catalog);
        setCourseCatalogError("");
        await loadCatalog();
    }, [loadCatalog, mode]);
    const saveSingleCourse = (0, react_1.useCallback)(async (coursePayload) => {
        if (mode !== "admin") {
            throw new Error("Catalog updates are only available in admin mode.");
        }
        await (0, realtimeDb_1.upsertSingleCourseCatalogEntry)(coursePayload);
        setCourseCatalogError("");
        await loadCatalog();
    }, [loadCatalog, mode]);
    (0, react_1.useEffect)(() => {
        loadCatalog().catch(() => {
            // loadCatalog updates user-facing error state.
        });
    }, [loadCatalog]);
    return {
        courseCatalog,
        catalogLoading,
        courseCatalogError,
        loadCatalog,
        saveCatalog,
        saveSingleCourse,
    };
};
exports.useCourseCatalog = useCourseCatalog;
