import { createReadStream, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Readable, Transform, Writable, pipeline } from "node:stream";
import { promisify } from "node:util";

const pipelinePromise = promisify(pipeline);

/**
 * Node.js Streams Demo
 * Streams are efficient ways to handle reading/writing files, network communications,
 * or any kind of end-to-end information exchange in an efficient manner.
 */

async function runStreamsDemo() {
  console.log("--- Streams Demo ---\n");

  // 1. Readable Stream (Manual implementation)
  console.log("1. Manual Readable Stream:");
  const myReadable = new Readable({
    read() {
      this.push("Data chunk 1\n");
      this.push("Data chunk 2\n");
      this.push(null); // End of stream
    },
  });

  myReadable.on("data", (chunk) => {
    console.log(`Received: ${chunk.toString().trim()}`);
  });

  // Wait for the readable to finish to keep console output clean
  await new Promise((resolve) => myReadable.on("end", resolve));

  // 2. Transform Stream (Upper case conversion)
  console.log("\n2. Transform Stream (To Upper Case):");
  const upperCaseTransform = new Transform({
    transform(chunk, _encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    },
  });

  // 3. Writable Stream (Console logger)
  const logWritable = new Writable({
    write(chunk, _encoding, callback) {
      console.log(`Writing to "Mock Database": ${chunk.toString().trim()}`);
      callback();
    },
  });

  // 4. Using Pipeline to connect streams
  // Readable -> Transform -> Writable
  console.log("\n3. Pipeline (Readable -> Uppercase -> Writable):");
  const source = Readable.from(["apple", "banana", "cherry"]);

  await pipelinePromise(source, upperCaseTransform, logWritable);

  // 5. File System Streams (The real-world use case)
  console.log("\n4. File Streams:");
  const tempFile = join(process.cwd(), "temp-stream-demo.txt");
  writeFileSync(
    tempFile,
    "This is a large piece of data that we are reading using streams.",
  );

  const readStream = createReadStream(tempFile, {
    encoding: "utf8",
    highWaterMark: 10,
  });

  console.log("Reading file in small chunks (10 bytes):");
  readStream.on("data", (chunk) => {
    console.log(`Chunk: [${chunk}]`);
  });

  readStream.on("end", () => {
    console.log("Finished reading file.");
  });
}

runStreamsDemo().catch(console.error);
