import fs from "node:fs/promises";
import path from "node:path";
import { BinaryFileHandler } from "./demos/BinaryFileHandler.js";
import { TextFileHandler } from "./demos/TextFileHandler.js";

console.log("=== Node.js File System Module Demo ===");

async function main() {
  try {
    const dataDir = path.join(process.cwd(), "data");

    // 1. Prepare Environment: Ensure the data directory exists
    await fs.mkdir(dataDir, { recursive: true });
    console.log("Verified directory:", dataDir);

    // 2. Text Demo: Run full CRUD for text
    const textHandler = new TextFileHandler(dataDir);
    await textHandler.runDemo();

    // 3. Binary Demo: Run full CRUD for binary
    const binaryHandler = new BinaryFileHandler(dataDir);
    await binaryHandler.runDemo();

    // 4. Directory Status: Verify results
    console.log("\n--- Demo Completed ---");
    const files = await fs.readdir(dataDir);
    console.log("Files remaining in data folder:", files);
  } catch (error) {
    console.error("Main execution error:", error);
  }
}

main();
