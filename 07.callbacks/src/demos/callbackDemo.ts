import fs from "node:fs";
import path from "node:path";

export function runBasicCallbackDemo(dataDir: string) {
    console.log("=== Basic Callback Demo ===");

    const filePath = path.join(dataDir, "basic.txt");

    // 1. fs.writeFile with a simple callback
    fs.writeFile(filePath, "This is a basic callback demo content.", (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }
        console.log("1. File written successfully.");

        // 2. Nested callback to read the file after writing
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            console.log("2. Successfully read content:", data);
        });
    });
}
