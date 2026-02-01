import path from "node:path";

console.log("=== Node.js Path Module Demo ===");

// 1. path.join: Concatenates segments with platform-specific separator
const joinedPath = path.join("/users", "local", "bin", "script.js");
console.log("Joined Path:", joinedPath);

// 2. path.resolve: Resolves to an absolute path
const absolutePath = path.resolve("src", "index.ts");
console.log("Absolute Path:", absolutePath);

// 3. path.basename: Gets the last part of a path
const fileName = path.basename(absolutePath);
console.log("File Name:", fileName);

// 4. path.dirname: Gets the directory name
const dirName = path.dirname(absolutePath);
console.log("Directory Name:", dirName);

// 5. path.extname: Gets the file extension
const extension = path.extname(absolutePath);
console.log("Extension:", extension);

// 6. path.parse: Returns an object with path details
const pathDetails = path.parse(absolutePath);
console.log("Path Details:", pathDetails);

// 7. path.isAbsolute: Checks if path is absolute
console.log("Is absolute path?", path.isAbsolute(absolutePath));
console.log("Is 'src/index.ts' absolute?", path.isAbsolute("src/index.ts"));

// 8. path.normalize: Resolves .. and . segments and redundant separators
const messyPath = "///Users//local/../bin/./script.js";
const normalizedPath = path.normalize(messyPath);
console.log("Messy Path:", messyPath);
console.log("Normalized Path:", normalizedPath);

// 9. Platform specific separator
console.log("Platform Separator:", path.sep);
