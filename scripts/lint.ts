import { execSync } from "child_process";

console.log("Running linter...");

try {
  execSync("eslint src/**/*.ts", { stdio: "inherit" });
  console.log("Linting completed successfully");
} catch (error) {
  console.error("Linting failed:", error);
  process.exit(1);
}