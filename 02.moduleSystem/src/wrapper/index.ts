import { dirname } from "path";
import { fileURLToPath } from "url";

export function showModuleInfo() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  console.log("File URL: ", import.meta.url);
  console.log("Filename: ", __filename);
  console.log("Dirname:  ", __dirname);
}
