import { Router } from "express";
import { AuthRequest, verifyJWT } from "../middlewares/auth.middleware.js";
import { Todo } from "../models/todo.model.js";

const router: Router = Router();

// Dashboard - Get Todos
router.get("/", verifyJWT, async (req: AuthRequest, res) => {
  const todos = await Todo.find({ user: req.user?._id }).sort({
    createdAt: -1,
  });
  res.render("index", { todos, user: req.user });
});

// Add Todo
router.post("/add", verifyJWT, async (req: AuthRequest, res) => {
  const { task } = req.body;
  if (task) {
    await Todo.create({ user: req.user?._id, task });
  }
  res.redirect("/");
});

// Toggle Todo
router.post("/toggle/:id", verifyJWT, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (todo) {
    todo.completed = !todo.completed;
    await todo.save();
  }
  res.redirect("/");
});

// Delete Todo
router.post("/delete/:id", verifyJWT, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

export default router;
