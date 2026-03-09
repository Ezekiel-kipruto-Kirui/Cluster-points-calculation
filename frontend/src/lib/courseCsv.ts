import Papa from "papaparse";

type CsvRow = Record<string, unknown>;

type CourseRequirement = {
  subject: string;
  grade: string;
};

type UniversityEntry = {
  name: string;
  courseCode: string;
  cutoff: number;
};

type CourseEntry = {
  name: string;
  requirements: CourseRequirement[];
  universities: UniversityEntry[];
};

type Catalog = Record<number, CourseEntry[]>;

const COLUMN_NAMES = {
  courseName: "COURSE NAME",
  cluster: "CLUSTER",
  courseCode: "COURSE CODE",
  university: "UNIVERSITY",
  cutoff: "CUT-OFF POINTS",
  requirements: "MINIMUM SUBJECT REQUIREMENTS",
} as const;

const normalizeText = (value: unknown): string => String(value ?? "").replace(/\u00a0/g, " ").trim();

const parseCutoff = (value: unknown): number => {
  const cleaned = normalizeText(value).replace(/,/g, "");
  if (!cleaned || cleaned === "-") return 0;
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseRequirements = (value: unknown): CourseRequirement[] => {
  const cleaned = normalizeText(value);
  if (!cleaned || /^none$/i.test(cleaned) || cleaned === "-") return [];

  const requirements: CourseRequirement[] = [];
  cleaned
    .split(/\r?\n|;/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((entry) => {
      if (/^none$/i.test(entry) || entry === "-") return;
      const separatorIndex = entry.indexOf(":");
      if (separatorIndex < 0) return;
      const subject = entry.slice(0, separatorIndex).trim();
      const grade = entry.slice(separatorIndex + 1).trim().toUpperCase();
      if (!subject || !grade || grade === "-") return;
      requirements.push({ subject, grade });
    });
  return requirements;
};

const mergeRequirements = (current: CourseRequirement[] = [], next: CourseRequirement[] = []): CourseRequirement[] => {
  const merged = [...current];
  next.forEach((item) => {
    if (!item?.subject || !item?.grade) return;
    const index = merged.findIndex((entry) => entry.subject === item.subject);
    if (index >= 0) merged[index] = item;
    else merged.push(item);
  });
  return merged;
};

const dedupeUniversities = (universities: UniversityEntry[]): UniversityEntry[] => {
  const seen = new Set<string>();
  const list: UniversityEntry[] = [];
  universities.forEach((entry) => {
    const key = `${entry.name}|${entry.courseCode}`;
    if (!entry.name || seen.has(key)) return;
    seen.add(key);
    list.push(entry);
  });
  return list;
};

const rowHasValues = (row: CsvRow): boolean =>
  Object.values(COLUMN_NAMES).some((columnName) => normalizeText(row?.[columnName]));

export const parseCourseCsvToCatalog = (csvText: string): Catalog => {
  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: false,
  });

  if (!Array.isArray(parsed.data) || !parsed.data.length) {
    throw new Error("CSV has no records.");
  }

  const catalog: Catalog = {};
  let currentCourse:
    | {
        name: string;
        cluster: number;
        requirements: CourseRequirement[];
        universities: UniversityEntry[];
      }
    | null = null;

  const pushCurrentCourse = () => {
    if (!currentCourse) return;
    if (!catalog[currentCourse.cluster]) catalog[currentCourse.cluster] = [];
    catalog[currentCourse.cluster].push({
      name: currentCourse.name,
      requirements: currentCourse.requirements,
      universities: dedupeUniversities(currentCourse.universities),
    });
    currentCourse = null;
  };

  parsed.data.forEach((row) => {
    if (!row || typeof row !== "object" || !rowHasValues(row)) return;

    const courseName = normalizeText(row[COLUMN_NAMES.courseName]);
    const clusterRaw = normalizeText(row[COLUMN_NAMES.cluster]);
    const courseCode = normalizeText(row[COLUMN_NAMES.courseCode]);
    const university = normalizeText(row[COLUMN_NAMES.university]);
    const cutoffRaw = normalizeText(row[COLUMN_NAMES.cutoff]);
    const requirementsRaw = normalizeText(row[COLUMN_NAMES.requirements]);
    const cluster = Number(clusterRaw);

    const startsNewCourse = Boolean(courseName && Number.isInteger(cluster) && cluster > 0);
    if (startsNewCourse) {
      pushCurrentCourse();
      currentCourse = {
        name: courseName,
        cluster,
        requirements: parseRequirements(requirementsRaw),
        universities: [],
      };
    } else if (!currentCourse) {
      return;
    }

    if (requirementsRaw) {
      currentCourse.requirements = mergeRequirements(currentCourse.requirements, parseRequirements(requirementsRaw));
    }

    if (university || courseCode || cutoffRaw) {
      currentCourse.universities.push({
        name: university || "Unknown University",
        courseCode,
        cutoff: parseCutoff(cutoffRaw),
      });
    }
  });

  pushCurrentCourse();

  if (!Object.keys(catalog).length) {
    throw new Error("CSV did not produce a valid course catalog.");
  }

  return catalog;
};

export const summarizeCourseCatalog = (
  catalog: Record<number, { universities: UniversityEntry[] }[]> | null | undefined,
): { clusters: number; courses: number; universities: number } => {
  const clusters = Object.keys(catalog || {}).length;
  let courses = 0;
  let universities = 0;

  Object.values(catalog || {}).forEach((entries) => {
    if (!Array.isArray(entries)) return;
    courses += entries.length;
    entries.forEach((course) => {
      universities += Array.isArray(course.universities) ? course.universities.length : 0;
    });
  });

  return { clusters, courses, universities };
};

