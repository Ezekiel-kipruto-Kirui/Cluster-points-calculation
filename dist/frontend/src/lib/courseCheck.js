"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubjectRequirements = void 0;
const GRADE_ORDER = {
    A: 12,
    "A-": 11,
    "B+": 10,
    B: 9,
    "B-": 8,
    "C+": 7,
    C: 6,
    "C-": 5,
    "D+": 4,
    D: 3,
    "D-": 2,
    E: 1,
};
const SUBJECT_NORMALIZATION = {
    ENGLISH: "ENG",
    KISWAHILI: "KIS",
    MATHEMATICS: "MAT",
    MATH: "MAT",
    BIOLOGY: "BIO",
    CHEMISTRY: "CHE",
    PHYSICS: "PHY",
    "GENERAL SCIENCE": "GSC",
    HISTORY: "HAG",
    "HISTORY & GOVERNMENT": "HAG",
    GEOGRAPHY: "GEO",
    CRE: "CRE",
    IRE: "IRE",
    HRE: "HRE",
    "COMPUTER STUDIES": "CMP",
    AGRICULTURE: "AGR",
    "ART & DESIGN": "ARD",
    "HOME SCIENCE": "HSC",
    "BUSINESS STUDIES": "BST",
    FRENCH: "FRE",
    GERMAN: "GER",
    MUSIC: "MUS",
    ARABIC: "ARB",
};
const checkSubjectRequirements = (studentGradesByCode, requirements) => {
    const failed = [];
    for (const [requirement, requiredGradeRaw] of Object.entries(requirements || {})) {
        const requiredGrade = String(requiredGradeRaw || "").trim().toUpperCase();
        if (!(requiredGrade in GRADE_ORDER))
            continue;
        const options = String(requirement)
            .split("/")
            .map((subjectName) => {
            const upper = subjectName.trim().toUpperCase();
            return SUBJECT_NORMALIZATION[upper] || upper;
        });
        let met = false;
        let matchedSubject = null;
        let matchedGrade = null;
        for (const subjectCode of options) {
            const studentGrade = (studentGradesByCode[subjectCode] || "").toUpperCase();
            if (!studentGrade)
                continue;
            if ((GRADE_ORDER[studentGrade] || 0) >= GRADE_ORDER[requiredGrade]) {
                met = true;
                break;
            }
            matchedSubject = subjectCode;
            matchedGrade = studentGrade;
        }
        if (!met) {
            failed.push({
                subject: requirement,
                required: requiredGrade,
                studentSubject: matchedSubject,
                studentGrade: matchedGrade,
            });
        }
    }
    return { passed: failed.length === 0, failed };
};
exports.checkSubjectRequirements = checkSubjectRequirements;
