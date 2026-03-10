"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeCourseCatalog = exports.parseCourseCsvToCatalog = void 0;
const papaparse_1 = __importDefault(require("papaparse"));
const COLUMN_NAMES = {
    courseName: "COURSE NAME",
    cluster: "CLUSTER",
    courseCode: "COURSE CODE",
    university: "UNIVERSITY",
    cutoff: "CUT-OFF POINTS",
    requirements: "MINIMUM SUBJECT REQUIREMENTS",
};
const normalizeText = (value) => String(value ?? "").replace(/\u00a0/g, " ").trim();
const parseCutoff = (value) => {
    const cleaned = normalizeText(value).replace(/,/g, "");
    if (!cleaned || cleaned === "-")
        return 0;
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
};
const parseRequirements = (value) => {
    const cleaned = normalizeText(value);
    if (!cleaned || /^none$/i.test(cleaned) || cleaned === "-")
        return [];
    const requirements = [];
    cleaned
        .split(/\r?\n|;/)
        .map((entry) => entry.trim())
        .filter(Boolean)
        .forEach((entry) => {
        if (/^none$/i.test(entry) || entry === "-")
            return;
        const separatorIndex = entry.indexOf(":");
        if (separatorIndex < 0)
            return;
        const subject = entry.slice(0, separatorIndex).trim();
        const grade = entry.slice(separatorIndex + 1).trim().toUpperCase();
        if (!subject || !grade || grade === "-")
            return;
        requirements.push({ subject, grade });
    });
    return requirements;
};
const mergeRequirements = (current = [], next = []) => {
    const merged = [...current];
    next.forEach((item) => {
        if (!item?.subject || !item?.grade)
            return;
        const index = merged.findIndex((entry) => entry.subject === item.subject);
        if (index >= 0)
            merged[index] = item;
        else
            merged.push(item);
    });
    return merged;
};
const dedupeUniversities = (universities) => {
    const seen = new Set();
    const list = [];
    universities.forEach((entry) => {
        const key = `${entry.name}|${entry.courseCode}`;
        if (!entry.name || seen.has(key))
            return;
        seen.add(key);
        list.push(entry);
    });
    return list;
};
const rowHasValues = (row) => Object.values(COLUMN_NAMES).some((columnName) => normalizeText(row?.[columnName]));
const parseCourseCsvToCatalog = (csvText) => {
    const parsed = papaparse_1.default.parse(csvText, {
        header: true,
        skipEmptyLines: false,
    });
    if (!Array.isArray(parsed.data) || !parsed.data.length) {
        throw new Error("CSV has no records.");
    }
    const catalog = {};
    let currentCourse = null;
    const pushCurrentCourse = () => {
        if (!currentCourse)
            return;
        if (!catalog[currentCourse.cluster])
            catalog[currentCourse.cluster] = [];
        catalog[currentCourse.cluster].push({
            name: currentCourse.name,
            requirements: currentCourse.requirements,
            universities: dedupeUniversities(currentCourse.universities),
        });
        currentCourse = null;
    };
    parsed.data.forEach((row) => {
        if (!row || typeof row !== "object" || !rowHasValues(row))
            return;
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
        }
        else if (!currentCourse) {
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
exports.parseCourseCsvToCatalog = parseCourseCsvToCatalog;
const summarizeCourseCatalog = (catalog) => {
    const clusters = Object.keys(catalog || {}).length;
    let courses = 0;
    let universities = 0;
    Object.values(catalog || {}).forEach((entries) => {
        if (!Array.isArray(entries))
            return;
        courses += entries.length;
        entries.forEach((course) => {
            universities += Array.isArray(course.universities) ? course.universities.length : 0;
        });
    });
    return { clusters, courses, universities };
};
exports.summarizeCourseCatalog = summarizeCourseCatalog;
