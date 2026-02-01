import fs from "node:fs";
import path from "node:path";

export function runCallbackHellDemo(dataDir: string) {
  console.log("=== Callback Hell Demo ===");

  const filePath = path.join(dataDir, "hell.txt");

  // WARNING: Pyramid of Doom / Callback Hell ahead!
  fs.writeFile(filePath, "Initial Content\n", (err) => {
    if (err) {
      console.error("Write Error:", err);
    } else {
      console.log("Level 1: File Created");

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Read Error:", err);
        } else {
          console.log("Level 2: Read Content ->", data.trim());

          fs.appendFile(filePath, "Appended Content\n", (err) => {
            if (err) {
              console.error("Append Error:", err);
            } else {
              console.log("Level 3: Content Appended");

              fs.stat(filePath, (err, stats) => {
                if (err) {
                  console.error("Stat Error:", err);
                } else {
                  console.log(
                    "Level 4: File Stats retrieved. Size:",
                    stats.size,
                  );

                  fs.readFile(filePath, "utf8", (err, finalData) => {
                    if (err) {
                      console.error("Final Read Error:", err);
                    } else {
                      console.log("Level 5: Final Content:\n", finalData);

                      fs.unlink(filePath, (err) => {
                        if (err) {
                          console.error("Unlink Error:", err);
                        } else {
                          console.log("Level 6: File Cleaned up (Unlinked).");
                          console.log("\n--- Callback Hell Completed ---");
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}
