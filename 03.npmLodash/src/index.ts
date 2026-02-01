import _ from "lodash";

console.log("=== Lodash Utility Demo ===");

// 1. Array Manipulation: Chunking
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const chunked = _.chunk(numbers, 3);
console.log("Chunked Array (size 3):", chunked);

// 2. Collection: Unique values
const dupes = [1, 2, 1, 4, 5, 2];
const unique = _.uniq(dupes);
console.log("Unique values:", unique);

// 3. Math/Utility: Random
const randomNum = _.random(1, 100);
console.log("Random number between 1 and 100:", randomNum);

// 4. Object: Picking properties
const user = { id: 1, name: "Gemini", role: "AI", secret: "12345" };
const publicUser = _.pick(user, ["name", "role"]);
console.log("Public User Data:", publicUser);
