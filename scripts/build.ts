import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("Building CTTP...");

try {
  execSync("tsc -p tsconfig.build.json", { stdio: "inherit" });
  console.log("Build completed successfully");
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}