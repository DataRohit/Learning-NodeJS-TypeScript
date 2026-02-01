import { math } from "./math/index.js";
import { showModuleInfo } from "./wrapper/index.js";

console.log("Welcome to the Module System exploration!");

// 1. Math Module
console.log("\n1. Math Module Demo:");
console.log(`10 + 5 = ${math.add(10, 5)}`);
console.log(`20 / 4 = ${math.divide(20, 4)}`);

// 2. Module Wrapper
console.log("\n2. Module Wrapper Demo:");
showModuleInfo();
