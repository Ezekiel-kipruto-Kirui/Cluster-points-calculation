import { useCallback, useEffect, useState } from "react";
import { fetchCourseCatalog, uploadCourseCatalog, upsertSingleCourseCatalogEntry, type NormalizedCatalog } from "../lib/realtimeDb";
import { parseCourseCsvToCatalog } from "../lib/courseCsv";
import bundledCoursesCsvText from "../courses.csv?raw";

type UseCourseCatalogMode = "public" | "admin";

type UseCourseCatalogOptions = {
  mode?: UseCourseCatalogMode;
};

const normalizeCsvRequirements = (value: any): Record<string, string> => {
  if (!Array.isArray(value)) return {};
  const mapped: Record<string, string> = {};
  value.forEach((entry) => {
    const subject = String(entry?.subject || "").trim();
    const grade = String(entry?.grade || "").trim().toUpperCase();
    if (!subject || !grade) return;
    mapped[subject] = grade;
  });
  return mapped;
};

const normalizeCsvCatalog = (value: any): NormalizedCatalog => {
  if (!value || typeof value !== "object") return {};
  const normalized: NormalizedCatalog = {};

  Object.entries(value).forEach(([clusterKey, clusterCourses]) => {
    const cluster = Number(clusterKey);
    if (!Number.isInteger(cluster) || cluster < 1) return;

    const rows = Array.isArray(clusterCourses) ? clusterCourses : [];
    normalized[cluster] = rows
      .map((course: any) => ({
        name: String(course?.name || "").trim(),
        requirements: normalizeCsvRequirements(course?.requirements),
        universities: Array.isArray(course?.universities)
          ? course.universities
              .map((university: any) => ({
                name: String(university?.name || "").trim(),
                courseCode: String(university?.courseCode || "").trim(),
                cutoff: Number(university?.cutoff ?? 0),
              }))
              .filter((entry: any) => Boolean(entry.name))
          : [],
      }))
      .filter((course) => Boolean(course.name));
  });

  return normalized;
};

let bundledCatalogCache: NormalizedCatalog | null = null;
const getBundledCatalog = (): NormalizedCatalog => {
  if (bundledCatalogCache) return bundledCatalogCache;
  const parsed = parseCourseCsvToCatalog(bundledCoursesCsvText);
  bundledCatalogCache = normalizeCsvCatalog(parsed);
  return bundledCatalogCache;
};

export const useCourseCatalog = ({ mode = "public" }: UseCourseCatalogOptions = {}) => {
  const [courseCatalog, setCourseCatalog] = useState<NormalizedCatalog>({});
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [courseCatalogError, setCourseCatalogError] = useState("");

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    if (mode !== "admin") {
      try {
        const bundledCatalog = getBundledCatalog();
        setCourseCatalog(bundledCatalog);
        setCourseCatalogError("");
      } catch (error: any) {
        setCourseCatalog({});
        setCourseCatalogError(error?.message || "Unable to load bundled course catalog.");
      } finally {
        setCatalogLoading(false);
      }
      return;
    }

    try {
      const catalog = await fetchCourseCatalog();
      setCourseCatalog(catalog);
      setCourseCatalogError("");
    } catch (error: any) {
      const bundledFallback = getBundledCatalog();
      setCourseCatalog(bundledFallback);
      const message = error?.message || "Unable to load courses from realtime database.";
      setCourseCatalogError(`${message} Showing bundled courses until backend connection is available.`);
    } finally {
      setCatalogLoading(false);
    }
  }, [mode]);

  const saveCatalog = useCallback(
    async (catalog: any) => {
      if (mode !== "admin") {
        throw new Error("Catalog updates are only available in admin mode.");
      }
      await uploadCourseCatalog(catalog);
      setCourseCatalogError("");
      await loadCatalog();
    },
    [loadCatalog, mode],
  );

  const saveSingleCourse = useCallback(
    async (coursePayload: {
      cluster: number;
      name: string;
      requirements: any;
      universities: any[];
    }) => {
      if (mode !== "admin") {
        throw new Error("Catalog updates are only available in admin mode.");
      }
      await upsertSingleCourseCatalogEntry(coursePayload);
      setCourseCatalogError("");
      await loadCatalog();
    },
    [loadCatalog, mode],
  );

  useEffect(() => {
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
