import http from "node:http";
import { handleJsonTodoRoutes } from "./routes/jsonTodoRoutes.js";
import { handleStatusRoutes } from "./routes/statusRoutes.js";
import { handleTextTodoRoutes } from "./routes/textTodoRoutes.js";

const PORT = 3000;

console.log("=== Node.js Todo API Demo (Text & JSON) ===");

const server = http.createServer(async (req, res) => {
  const { url } = req;

  // Route routing (using if/else for simplicity)
  if (url === "/api/todos/text") {
    // Handle Request via Text File Storage
    await handleTextTodoRoutes(req, res);
  } else if (url === "/api/todos/json") {
    // Handle Request via JSON File Storage
    await handleJsonTodoRoutes(req, res);
  } else if (url?.startsWith("/api/status")) {
    // Handle Request for different Status Codes
    await handleStatusRoutes(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error:
          "Route not found. Use /api/todos/text, /api/todos/json, or /api/status/:code",
      }),
    );
  }
});

server.listen(PORT, () => {
  console.log(`\nServer listening on http://localhost:${PORT}`);
  console.log(`- Text API:   http://localhost:${PORT}/api/todos/text`);
  console.log(`- JSON API:   http://localhost:${PORT}/api/todos/json`);
  console.log(
    `- Status API: http://localhost:${PORT}/api/status/200 (Replace 200 with 201, 400, 500 etc.)`,
  );
  console.log("\nPress Ctrl+C to stop the server.");
});
