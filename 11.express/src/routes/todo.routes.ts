import { Request, Response, Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "../../data/todos.json");

const router: Router = Router();

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Helper to read todos
const readTodos = async (): Promise<Todo[]> => {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading todos:", error);
    return [];
  }
};

// Helper to write todos
const writeTodos = async (todos: Todo[]): Promise<void> => {
  await fs.writeFile(DATA_PATH, JSON.stringify(todos, null, 2));
};

// GET all todos
router.get("/", async (_req: Request, res: Response) => {
  const todos = await readTodos();
  res.json(todos);
});

// POST a new todo
router.post("/", async (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const todos = await readTodos();
  const newTodo: Todo = {
    id: todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1,
    title,
    completed: false,
  };

  todos.push(newTodo);
  await writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT update a todo
router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const { title, completed } = req.body;

  const todos = await readTodos();
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  todos[index] = {
    ...todos[index],
    title: title ?? todos[index].title,
    completed: completed ?? todos[index].completed,
  };
  await writeTodos(todos);
  res.json(todos[index]);
});

// DELETE a todo
router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const todos = await readTodos();
  const updatedTodos = todos.filter((t) => t.id !== id);

  if (todos.length === updatedTodos.length) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  await writeTodos(updatedTodos);
  res.status(204).send();
});

export default router;
