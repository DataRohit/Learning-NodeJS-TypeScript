import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const jsonFilePath = path.join(process.cwd(), "data", "todos.json");

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

async function getRequestBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => resolve(body));
    req.on("error", (err) => reject(err));
  });
}

export async function handleJsonTodoRoutes(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const { method } = req;

  try {
    const fileData = await fs.readFile(jsonFilePath, "utf8");
    let todos: Todo[] = JSON.parse(fileData || "[]");

    if (method === "GET") {
      // READ
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todos));
    } else if (method === "POST") {
      // CREATE
      const body = await getRequestBody(req);
      const { task } = JSON.parse(body);

      const newTodo: Todo = { id: Date.now(), task, completed: false };
      todos.push(newTodo);

      await fs.writeFile(jsonFilePath, JSON.stringify(todos, null, 2));

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newTodo));
    } else if (method === "PUT") {
      // UPDATE: Toggle completion status
      const body = await getRequestBody(req);
      const { id } = JSON.parse(body);

      todos = todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );

      await fs.writeFile(jsonFilePath, JSON.stringify(todos, null, 2));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } else if (method === "DELETE") {
      // DELETE: Remove a todo by ID
      const body = await getRequestBody(req);
      const { id } = JSON.parse(body);

      todos = todos.filter((t) => t.id !== id);

      await fs.writeFile(jsonFilePath, JSON.stringify(todos, null, 2));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, deletedId: id }));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: (error as Error).message }));
  }
}
