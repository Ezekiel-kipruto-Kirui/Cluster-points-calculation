const { execSync } = require("child_process");

const shouldSkipBuild = () => {
  const raw = String(process.env.SKIP_BUILD || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
};

if (shouldSkipBuild()) {
  console.log("SKIP_BUILD=true -> skipping build steps.");
  process.exit(0);
}

execSync("npm run build:frontend", { stdio: "inherit" });
execSync("npm run build:backend", { stdio: "inherit" });
