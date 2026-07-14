import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("Generating documentation...");

try {
  if (!fs.existsSync("docs/api")) {
    fs.mkdirSync("docs/api", { recursive: true });
  }
  execSync("typedoc --out docs/api src/index.ts", { stdio: "inherit" });
  console.log("Documentation generated successfully");
} catch (error) {
  console.error("Documentation generation failed:", error);
  process.exit(1);
}