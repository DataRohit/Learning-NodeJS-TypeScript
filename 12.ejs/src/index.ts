import express, { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, "../data/todos.json");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Helper functions for JSON persistence
interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

const getTodos = async (): Promise<Todo[]> => {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveTodos = async (todos: Todo[]): Promise<void> => {
  await fs.writeFile(DATA_PATH, JSON.stringify(todos, null, 2));
};

// Routes
app.get("/", async (_req: Request, res: Response) => {
  const todos = await getTodos();
  res.render("index", { todos });
});

app.post("/add", async (req: Request, res: Response) => {
  const { task } = req.body;
  if (task) {
    const todos = await getTodos();
    const newTodo: Todo = {
      id: Date.now(),
      task,
      completed: false,
    };
    todos.push(newTodo);
    await saveTodos(todos);
  }
  res.redirect("/");
});

app.post("/toggle/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const todos = await getTodos();
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    await saveTodos(todos);
  }
  res.redirect("/");
});

app.post("/delete/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  let todos = await getTodos();
  todos = todos.filter((t) => t.id !== id);
  await saveTodos(todos);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`EJS Todo server running at http://localhost:${PORT}`);
});
