import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const textFilePath = path.join(process.cwd(), "data", "todos.txt");

async function getRequestBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => resolve(body));
    req.on("error", (err) => reject(err));
  });
}

export async function handleTextTodoRoutes(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const { method } = req;

  try {
    if (method === "GET") {
      // READ: Get all todos as plain text
      const content = await fs.readFile(textFilePath, "utf8");

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Your Todos:\n${content}`);
    } else if (method === "POST") {
      // CREATE: Add a new todo line
      const todo = await getRequestBody(req);
      await fs.appendFile(textFilePath, `\n${todo || "New Tasks"}`, "utf8");

      res.writeHead(201, { "Content-Type": "text/plain" });
      res.end("POST: Todo added to text file.");
    } else if (method === "PUT") {
      // UPDATE: Overwrite the entire file with updated list
      const updatedList = await getRequestBody(req);
      await fs.writeFile(textFilePath, updatedList, "utf8");

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("PUT: Text todos overwritten/updated.");
    } else if (method === "DELETE") {
      // DELETE: Clear all text todos
      await fs.writeFile(textFilePath, "", "utf8");

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("DELETE: All text todos cleared.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(`Server Error: ${(error as Error).message}`);
  }
}
