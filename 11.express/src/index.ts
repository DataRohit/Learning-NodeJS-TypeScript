import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import todoRouter from "./routes/todo.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware
app.use(loggerMiddleware);

// Routes
app.get("/", (_req, res) => {
  res.send("Welcome to the Todo API with Express and TypeScript!");
});

app.use("/api/todos", todoRouter);

// Error Handling Middleware (Custom)
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  },
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
