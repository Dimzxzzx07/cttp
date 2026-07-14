import { execSync } from "child_process";

console.log("Running benchmarks...");

try {
  execSync("tsc -p tsconfig.test.json", { stdio: "inherit" });
  execSync("node dist-tests/benchmarks/index.js", { stdio: "inherit" });
  console.log("Benchmarks completed successfully");
} catch (error) {
  console.error("Benchmarks failed:", error);
  process.exit(1);
}