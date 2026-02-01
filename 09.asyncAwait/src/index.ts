import path from "node:path";
import { runAsyncAwaitDemo } from "./demos/asyncAwaitDemo.js";

const dataDir = path.join(process.cwd(), "data");

console.log("=== Node.js Asynchronous Programming ===\n");

async function init() {
  try {
    await runAsyncAwaitDemo(dataDir);
  } catch (err) {
    console.error("Main initialization failed:", err);
  }
}

init();
