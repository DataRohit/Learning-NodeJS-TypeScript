/**
 * Node.js Event Loop Demo
 * Demonstrates the execution order of synchronous code, microtasks, and macrotasks.
 *
 * Execution Hierarchy:
 * 1. Synchronous Code (Call Stack)
 * 2. Microtasks (process.nextTick) - Highest priority
 * 3. Microtasks (Promises/queueMicrotask)
 * 4. Macrotasks (Timers - setTimeout/setInterval)
 * 5. Macrotasks (Check phase - setImmediate)
 */

console.log("1. [Sync] Script start");

// Macrotask: Timers (Phase 1)
setTimeout(() => {
  console.log("7. [Macrotask] setTimeout (0ms)");
}, 0);

// Macrotask: Check Phase (Phase 5 - executed after I/O or at the end of the loop)
setImmediate(() => {
  console.log("8. [Macrotask] setImmediate");
});

// Microtask: process.nextTick
process.nextTick(() => {
  console.log("3. [Microtask] process.nextTick");

  // Nested nextTick
  process.nextTick(() => {
    console.log("5. [Microtask] Inner process.nextTick");
  });
});

// Microtask: Promise
Promise.resolve().then(() => {
  console.log("4. [Microtask] Promise.then");

  // Nested Promise
  Promise.resolve().then(() => {
    console.log("6. [Microtask] Inner Promise.then");
  });
});

console.log("2. [Sync] Script end");

/**
 * Expected Output explanation:
 * - Sync code runs first (1, 2)
 * - All nextTicks run after current operation (3, 5)
 * - All Promises run after nextTicks (4, 6)
 * - Then the event loop moves to the next phase (Timers - 7)
 * - Then setImmediate (8)
 *
 * Note: The relative order of setImmediate and setTimeout(0) can sometimes be
 * non-deterministic when not inside an I/O callback, but in most modern Node.js versions,
 * setTimeout(0) usually runs before setImmediate if they are called in the main module.
 */
