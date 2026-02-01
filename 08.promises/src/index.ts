import path from "node:path";
import { runPromisesDemo } from "./demos/promisesDemo.js";

const dataDir = path.join(process.cwd(), "data");

async function main() {
  try {
    await runPromisesDemo(dataDir);
  } catch (error) {
    console.error("Main error:", error);
  }
}

main();
