const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const shouldSkipBuild = () => {
  const raw = String(process.env.SKIP_BUILD || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
};

if (shouldSkipBuild()) {
  console.log("SKIP_BUILD=true -> skipping build steps.");
  process.exit(0);
}

const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");

const binExists = (baseDir, binName) => {
  const binDir = path.join(baseDir, "node_modules", ".bin");
  const candidates =
    process.platform === "win32" ? [`${binName}.cmd`, `${binName}.ps1`, binName] : [binName];
  return candidates.some((candidate) => fs.existsSync(path.join(binDir, candidate)));
};

const ensureDevDeps = (label, dir, binName) => {
  if (binExists(dir, binName)) return;
  console.log(`${label} deps missing -> running npm ci --include=dev`);
  execSync("npm ci --include=dev", { stdio: "inherit", cwd: dir });
};

ensureDevDeps("Backend", rootDir, "tsc");
ensureDevDeps("Frontend", frontendDir, "vite");

execSync("npm run build:frontend", { stdio: "inherit", cwd: rootDir });
execSync("npm run build:backend", { stdio: "inherit", cwd: rootDir });
