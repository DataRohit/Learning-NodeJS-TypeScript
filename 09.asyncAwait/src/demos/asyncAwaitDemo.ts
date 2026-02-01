import fs from "node:fs/promises";
import path from "node:path";

async function simulateDelay(ms: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Waited for ${ms}ms`), ms);
  });
}

export async function runAsyncAwaitDemo(dataDir: string) {
  const filePath = path.join(dataDir, "async-demo.txt");

  console.log("=== Node.js Async/Await Demo ===\n");

  try {
    // A. Sequential Execution
    console.log("[Phase 1: Sequential Execution]");
    const message = await simulateDelay(500);
    console.log("Delay 1:", message);

    await fs.writeFile(filePath, "Async/Await is much cleaner!");
    console.log("1. File written successfully.");

    const content = await fs.readFile(filePath, "utf8");
    console.log("2. Read content:", content);

    await fs.appendFile(filePath, "\nHandling errors with try/catch is great.");
    console.log("3. Content appended.");

    const finalContent = await fs.readFile(filePath, "utf8");
    console.log("4. Final content:\n", finalContent);

    // B. Parallel Execution with Promise.all
    console.log("\n[Phase 2: Parallel Execution]");
    console.log("Starting multiple tasks...");

    const startTime = Date.now();
    const results = await Promise.all([
      simulateDelay(1000),
      simulateDelay(1000),
      simulateDelay(1000),
    ]);

    const endTime = Date.now();
    console.log("Results:", results);
    console.log(
      `Total time for 3x 1000ms tasks: ${endTime - startTime}ms (Parallel!)`,
    );

    // C. Cleanup
    await fs.unlink(filePath);
    console.log("\n5. File cleaned up.");
    console.log("\n--- Async/Await Demo Completed ---");
  } catch (error) {
    // 3. Error Handling
    console.error("Critical error in async demo:", (error as Error).message);
  }
}
