import fs from "node:fs/promises";
import path from "node:path";

export class TextFileHandler {
  private filePath: string;

  constructor(dataDir: string) {
    this.filePath = path.join(dataDir, "demo.txt");
  }

  async runDemo() {
    console.log("\n--- Text File CRUD Demo ---");

    // 1. CREATE: Writing text data to a file
    const content =
      "Hello, this is a text file demo!\nNode.js file system is powerful.";
    await fs.writeFile(this.filePath, content, "utf8");
    console.log("CREATE: Text file created at", this.filePath);

    // 2. READ: Reading text data from the file
    const readText = await fs.readFile(this.filePath, "utf8");
    console.log("READ: Content ->", readText);

    // 3. UPDATE: Appending text to the file
    await fs.appendFile(
      this.filePath,
      "\nUPDATE: Appending some more data...",
      "utf8",
    );
    const updatedText = await fs.readFile(this.filePath, "utf8");
    console.log("UPDATE: Final content ->", updatedText);

    // 4. DELETE: Removing the file
    await fs.unlink(this.filePath);
    console.log("DELETE: Text file removed.");
  }
}
