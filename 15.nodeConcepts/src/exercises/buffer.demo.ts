import { Buffer } from "node:buffer";

/**
 * Node.js Buffer Demo
 * Buffers are used to represent a fixed-length sequence of bytes.
 * They are useful for dealing with binary data, especially when dealing with TCP streams or file systems.
 */

console.log("--- Buffer Demo ---");

// 1. Creating Buffers
// Allocate a buffer of 10 bytes filled with zeros
const buf1 = Buffer.alloc(10);
console.log("Allocated 10 bytes:", buf1);

// Allocate a buffer of 10 bytes filled with 1s
const buf2 = Buffer.alloc(10, 1);
console.log("Allocated 10 bytes (filled with 1):", buf2);

// Create a buffer from a string
const buf3 = Buffer.from("Hello Node.js");
console.log("Buffer from string:", buf3);
console.log("Buffer content (hex):", buf3.toString("hex"));
console.log("Buffer content (base64):", buf3.toString("base64"));

// 2. Writing to Buffers
const buf4 = Buffer.alloc(15);
const length = buf4.write("Learning Buffers");
console.log(`Wrote ${length} bytes to buffer:`, buf4.toString());

// 3. Reading from Buffers
console.log("First byte as integer:", buf4[0]); // 'L' is 76
console.log("Byte at index 9:", buf4[9]); // 'B' is 66

// 4. Buffer Operations: Slicing (Share memory)
const subBuf = buf4.subarray(0, 8);
console.log("Sub-buffer (first 8 bytes):", subBuf.toString());

// Modifying the sub-buffer modifies the original buffer!
subBuf.write("DYNAMIC");
console.log("Modified original buffer via subarray:", buf4.toString());

// 5. Concatenating Buffers
const combined = Buffer.concat([buf3, Buffer.from(" is powerful!")]);
console.log("Concatenated buffer:", combined.toString());

// 6. JSON Serialization
const json = JSON.stringify(buf3);
console.log("Buffer as JSON:", json);
const parsed = JSON.parse(json);
console.log("Parsed JSON back to Buffer:", Buffer.from(parsed.data).toString());
