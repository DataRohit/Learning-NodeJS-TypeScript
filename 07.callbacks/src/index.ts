import path from "node:path";
import { runBasicCallbackDemo } from "./demos/callbackDemo.js";
import { runCallbackHellDemo } from "./demos/callbackHell.js";

const dataDir = path.join(process.cwd(), "data");

console.log("=== Node.js Callbacks Exploration ===\n");

// Run basic demo
runBasicCallbackDemo(dataDir);

// Run callback hell demo with a delay to avoid mixed console logs
setTimeout(() => {
  console.log("\n" + "-".repeat(40) + "\n");
  runCallbackHellDemo(dataDir);
}, 1000);
