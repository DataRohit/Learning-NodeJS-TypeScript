import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import path from "node:path";

export class BinaryFileHandler {
  private filePath: string;

  constructor(dataDir: string) {
    this.filePath = path.join(dataDir, "demo.bin");
  }

  async runDemo() {
    console.log("\n--- Binary File CRUD Demo ---");

    // 1. CREATE: Writing raw binary data to a file
    const initialBuffer = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
    await fs.writeFile(this.filePath, initialBuffer);
    console.log("CREATE: Binary file created with bytes:", initialBuffer);

    // 2. READ: Reading binary data into a Buffer
    const readBuffer = await fs.readFile(this.filePath);
    console.log("READ: Buffer read ->", readBuffer);
    console.log("READ: As String ->", readBuffer.toString());

    // 3. UPDATE: Modifying the buffer and overwriting
    const additionalData = Buffer.from([
      0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21,
    ]); // " World!"
    const combinedBuffer = Buffer.concat([readBuffer, additionalData]);
    await fs.writeFile(this.filePath, combinedBuffer);
    const updatedBuffer = await fs.readFile(this.filePath);
    console.log("UPDATE: Combined Buffer ->", updatedBuffer);
    console.log("UPDATE: As String ->", updatedBuffer.toString());

    // 4. DELETE: Removing the file
    await fs.unlink(this.filePath);
    console.log("DELETE: Binary file removed.");
  }
}
