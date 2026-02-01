import fs from "node:fs/promises";
import path from "node:path";

function simulateAsyncTask(success: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("Task started...");
    setTimeout(() => {
      if (success) {
        resolve("Task completed successfully! ✅");
      } else {
        reject(new Error("Task failed! ❌"));
      }
    }, 1000);
  });
}

export async function runPromisesDemo(dataDir: string) {
  const filePath = path.join(dataDir, "promise-demo.txt");

  console.log("=== Node.js Promises Demo ===\n");

  // 1. Manual Promise
  console.log("[Part A: Manual Promise]");
  simulateAsyncTask(true)
    .then((result) => console.log(result))
    .catch((error) => console.error(error.message))
    .finally(() => console.log("Manual task cleanup executed.\n"));

  // 2. fs/promises chaining
  console.log("[Part B: fs/promises chaining]");

  fs.writeFile(filePath, "Hello from the land of Promises!")
    .then(() => {
      console.log("1. File written successfully.");
      return fs.readFile(filePath, "utf8");
    })
    .then((data) => {
      console.log("2. Read content:", data);
      return fs.appendFile(filePath, "\nNo more callback hell!");
    })
    .then(() => {
      console.log("3. Content appended.");
      return fs.readFile(filePath, "utf8");
    })
    .then((finalData) => {
      console.log("4. Final content:\n", finalData);
      return fs.unlink(filePath);
    })
    .then(() => {
      console.log("5. File cleaned up.");
      console.log("\n--- Promises Demo Completed ---\n");
    })
    .catch((err) => {
      console.error("An error occurred during Promise chaining:", err);
    });
}
