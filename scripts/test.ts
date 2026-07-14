import { execSync } from "child_process";

console.log("Running tests...");

try {
  execSync("tsc -p tsconfig.test.json", { stdio: "inherit" });
  execSync("node dist-tests/tests/index.js", { stdio: "inherit" });
  console.log("Tests completed successfully");
} catch (error) {
  console.error("Tests failed:", error);
  process.exit(1);
}