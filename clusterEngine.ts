const GRADE_POINTS: Record<string, number> = {
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

const G1 = ["ENG", "KIS", "MAT"] as const;
const G2 = ["BIO", "CHE", "PHY", "GSC"] as const;
const G3 = ["HAG", "GEO", "CRE", "IRE", "HRE"] as const;
const G4 = ["CMP", "AGR", "ARD", "HSC"] as const;
const G5 = ["BST", "FRE", "GER", "MUS", "ARB"] as const;
const ALL = [...G1, ...G2, ...G3, ...G4, ...G5];

type SubjectCode = (typeof ALL)[number] | string;
type ScoreMap = Record<SubjectCode, number>;
type GradeMap = Record<SubjectCode, string>;

const best = (scores: ScoreMap, subjects: readonly SubjectCode[]): number =>
  Math.max(...subjects.map((subject) => (subject in scores ? scores[subject] : 0)), 0);

const nthBest = (scores: ScoreMap, subjects: readonly SubjectCode[], n: number): number => {
  const values = subjects
    .filter((subject) => subject in scores)
    .map((subject) => scores[subject])
    .sort((first, second) => second - first);
  return values.length >= n ? values[n - 1] : 0;
};

const top7Total = (scores: ScoreMap): number => {
  const values = Object.values(scores).sort((first, second) => second - first);
  return values.length >= 7 ? values.slice(0, 7).reduce((accumulator, value) => accumulator + value, 0) : 0;
};

const clusterFormula = (r: number, t: number): number =>
  Number((Math.sqrt((r / 48) * (t / 84)) * 48 * 0.94).toFixed(3));

export const medicineEligibility = (gradesByCode: GradeMap): boolean => {
  const required: SubjectCode[] = ["BIO", "CHE", "MAT"];
  return required.every((code) => gradesByCode[code] && gradesByCode[code] in GRADE_POINTS);
};

export const computeCluster = (cluster: number, rawGrades: GradeMap): number => {
  const scores: ScoreMap = {};
  for (const [subject, grade] of Object.entries(rawGrades)) {
    if (grade in GRADE_POINTS) scores[subject] = GRADE_POINTS[grade];
  }

  if (Object.keys(scores).length < 7) return 0.0;
  const t = top7Total(scores);
  const fail = () => 0.0;
  let r = 0;

  if (cluster === 1) {
    if (!("ENG" in scores || "KIS" in scores)) return fail();
    r =
      best(scores, ["ENG", "KIS"]) +
      Math.max(scores.MAT ?? 0, best(scores, G2)) +
      best(scores, G3) +
      Math.max(best(scores, G2), nthBest(scores, G3, 2), best(scores, G4), best(scores, G5));
  } else if (cluster === 2) {
    if (!("ENG" in scores || "KIS" in scores)) return fail();
    r =
      best(scores, ["ENG", "KIS"]) +
      (scores.MAT ?? 0) +
      Math.max(best(scores, G2), best(scores, G3)) +
      Math.max(best(scores, G2), best(scores, G3), best(scores, G4), best(scores, G5));
  } else if (cluster === 3) {
    if (!("ENG" in scores || "KIS" in scores)) return fail();
    r =
      best(scores, ["ENG", "KIS"]) +
      Math.max(scores.MAT ?? 0, best(scores, G2)) +
      best(scores, G3) +
      Math.max(best(scores, G2), nthBest(scores, G3, 2), best(scores, G4), best(scores, G5));
  } else if (cluster === 4) {
    if (!("MAT" in scores && "PHY" in scores)) return fail();
    r =
      scores.MAT +
      scores.PHY +
      Math.max(scores.BIO ?? 0, scores.CHE ?? 0, scores.GEO ?? 0) +
      Math.max(best(scores, G2), best(scores, G3), best(scores, G4), best(scores, G5));
  } else if (cluster === 5) {
    if (!("MAT" in scores && "PHY" in scores && "CHE" in scores)) return fail();
    r =
      scores.MAT +
      scores.PHY +
      scores.CHE +
      Math.max(scores.BIO ?? 0, best(scores, G3), best(scores, G4), best(scores, G5));
  } else if (cluster === 6) {
    if (!("MAT" in scores && "PHY" in scores)) return fail();
    r =
      scores.MAT +
      scores.PHY +
      best(scores, G3) +
      Math.max(nthBest(scores, G2, 2), nthBest(scores, G3, 2), best(scores, G4), best(scores, G5));
  } else if (cluster === 7) {
    if (!("MAT" in scores && "PHY" in scores)) return fail();
    r =
      scores.MAT +
      scores.PHY +
      Math.max(nthBest(scores, G2, 2), best(scores, G3)) +
      Math.max(best(scores, G2), best(scores, G3), best(scores, G4), best(scores, G5));
  } else if (cluster === 8) {
    if (!("MAT" in scores && "BIO" in scores)) return fail();
    r =
      scores.MAT +
      scores.BIO +
      Math.max(scores.PHY ?? 0, scores.CHE ?? 0) +
      Math.max(nthBest(scores, G2, 3), best(scores, G3), best(scores, G4), best(scores, G5));
  } else if (cluster === 9) {
    if (!("MAT" in scores)) return fail();
    r =
      scores.MAT +
      best(scores, G2) +
      nthBest(scores, G2, 2) +
      Math.max(nthBest(scores, G2, 3), best(scores, G3), best(scores, G4), best(scores, G5));
  } else if (cluster === 10) {
    if (!("MAT" in scores)) return fail();
    r =
      scores.MAT +
      best(scores, G2) +
      best(scores, G3) +
      Math.max(nthBest(scores, G2, 2), nthBest(scores, G3, 2), best(scores, G4), best(scores, G5));
  } else if (cluster === 11) {
    r = Math.max(
      (scores.CHE ?? 0) +
        Math.max(scores.MAT ?? 0, scores.PHY ?? 0) +
        Math.max(scores.BIO ?? 0, scores.HSC ?? 0) +
        Math.max(best(scores, ["ENG", "KIS"]), best(scores, G3), best(scores, G4), best(scores, G5)),
      Math.max(scores.BIO ?? 0, scores.GSC ?? 0) +
        (scores.MAT ?? 0) +
        Math.max(best(scores, G2), best(scores, G3)) +
        Math.max(
          best(scores, ["ENG", "KIS"]),
          best(scores, G2),
          best(scores, G3),
          best(scores, G4),
          best(scores, G5),
        ),
    );
  } else if (cluster === 12 || cluster === 13) {
    if (!("BIO" in scores && "CHE" in scores)) return fail();
    r =
      scores.BIO +
      scores.CHE +
      Math.max(scores.MAT ?? 0, scores.PHY ?? 0) +
      Math.max(
        best(scores, ["ENG", "KIS"]),
        nthBest(scores, G2, 3),
        best(scores, G3),
        best(scores, G4),
        best(scores, G5),
      );
  } else if (cluster === 14) {
    if (!("CHE" in scores)) return fail();
    r =
      Math.max(scores.BIO ?? 0, scores.AGR ?? 0, scores.HSC ?? 0) +
      scores.CHE +
      Math.max(scores.MAT ?? 0, scores.PHY ?? 0, scores.GEO ?? 0) +
      Math.max(best(scores, ["ENG", "KIS"]), best(scores, G3), best(scores, G4), best(scores, G5));
  } else if (cluster === 15) {
    if (!("BIO" in scores && "CHE" in scores)) return fail();
    r =
      scores.BIO +
      scores.CHE +
      Math.max(scores.MAT ?? 0, scores.PHY ?? 0, scores.AGR ?? 0) +
      Math.max(best(scores, ["ENG", "KIS"]), best(scores, G3), best(scores, G4), best(scores, G5));
  } else if (cluster === 16) {
    if (!("GEO" in scores)) return fail();
    r =
      scores.GEO +
      (scores.MAT ?? 0) +
      best(scores, G2) +
      Math.max(nthBest(scores, G2, 2), nthBest(scores, G3, 2), best(scores, G4), best(scores, G5));
  } else if (cluster === 17) {
    if (!("FRE" in scores || "GER" in scores)) return fail();
    r =
      best(scores, ["FRE", "GER"]) +
      best(scores, ["ENG", "KIS"]) +
      Math.max(scores.MAT ?? 0, best(scores, G2), best(scores, G3)) +
      Math.max(best(scores, G2), best(scores, G3), best(scores, G4), nthBest(scores, G5, 2));
  } else if (cluster === 18) {
    if (!("MUS" in scores)) return fail();
    r =
      scores.MUS +
      best(scores, ["ENG", "KIS"]) +
      Math.max(scores.MAT ?? 0, best(scores, G2), best(scores, G3)) +
      Math.max(best(scores, G2), best(scores, G3), best(scores, G4), nthBest(scores, G5, 2));
  } else if (cluster === 19) {
    r = best(scores, ALL) + nthBest(scores, ALL, 2) + nthBest(scores, ALL, 3) + nthBest(scores, ALL, 4);
  } else if (cluster === 20) {
    if (!(scores.CRE || scores.IRE || scores.HRE)) return fail();
    r =
      best(scores, ["CRE", "IRE", "HRE"]) +
      best(scores, ["ENG", "KIS"]) +
      nthBest(scores, G3, 2) +
      Math.max(best(scores, G2), best(scores, G4), best(scores, G5));
  } else {
    return fail();
  }

  return clusterFormula(r, t);
};

export const computeAllClusters = (rawGrades: GradeMap): Record<number, number> => {
  const results: Record<number, number> = {};
  for (let cluster = 1; cluster <= 20; cluster += 1) {
    results[cluster] = computeCluster(cluster, rawGrades);
  }
  return results;
};

export default {
  computeAllClusters,
  medicineEligibility,
};


