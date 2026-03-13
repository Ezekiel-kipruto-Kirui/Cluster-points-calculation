const test = require("node:test");
const assert = require("node:assert/strict");

const { computeCluster, computeAllClusters, medicineEligibility } = require("../dist/clusterEngine.js");

const allAGrades = {
  ENG: "A",
  MAT: "A",
  BIO: "A",
  CHE: "A",
  PHY: "A",
  GEO: "A",
  AGR: "A",
};

test("medicineEligibility returns true with required subjects", () => {
  assert.equal(
    medicineEligibility({
      BIO: "B",
      CHE: "B+",
      MAT: "B",
      ENG: "C+",
    }),
    true,
  );
});

test("medicineEligibility returns false when a requirement is missing", () => {
  assert.equal(
    medicineEligibility({
      BIO: "B",
      MAT: "B",
      ENG: "C+",
    }),
    false,
  );
});

test("medicineEligibility requires mathematics (physics alone is not enough)", () => {
  assert.equal(
    medicineEligibility({
      BIO: "B",
      CHE: "B",
      PHY: "B",
      ENG: "C+",
    }),
    false,
  );
});

test("computeCluster returns 0 with insufficient grades", () => {
  assert.equal(
    computeCluster(1, {
      ENG: "A",
      MAT: "A",
    }),
    0,
  );
});

test("computeCluster cluster 1 returns expected score", () => {
  assert.equal(computeCluster(1, allAGrades), 45.12);
});

test("computeAllClusters returns 20 clusters", () => {
  const results = computeAllClusters(allAGrades);
  assert.equal(Object.keys(results).length, 20);
  assert.equal(results[1], 45.12);
  assert.equal(results[4] > 0, true);
});
