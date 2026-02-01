import { printArrayWithDelay } from "./exercises/arrayTasks.js";
import { MathOperations } from "./exercises/mathTasks.js";

console.log("=== Node.js TypeScript Basics ===");

// 1. Array Task
const fruits = ["Apple", "Banana", "Cherry"];
printArrayWithDelay(fruits);

// 2. Math Task
const math = new MathOperations();
const a = 10;
const b = 5;

console.log("\n--- Math Operations task ---");
console.log(`${a} + ${b} = ${math.add(a, b)}`);
console.log(`${a} - ${b} = ${math.subtract(a, b)}`);
console.log(`${a} * ${b} = ${math.multiply(a, b)}`);
console.log(`${a} / ${b} = ${math.divide(a, b)}`);
