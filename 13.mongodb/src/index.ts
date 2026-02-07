import chalk from "chalk";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";

// Load Env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Morgan Logger with Chalk
app.use(
  morgan((tokens, req, res) => {
    return [
      chalk.gray(`[${new Date().toLocaleString()}]`),
      chalk.bold.blue(tokens.method(req, res)),
      chalk.yellow(tokens.url(req, res)),
      chalk.bold.green(tokens.status(req, res)),
      chalk.gray(tokens["response-time"](req, res) + " ms"),
    ].join(" ");
  }),
);

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", authRoutes);
app.use("/", todoRoutes);

// Error Handler
app.use(
  (
    _err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(chalk.red.bold("CRITICAL ERROR:"), _err.stack);
    res
      .status(500)
      .render("login", { error: "Something went incredibly wrong!" });
  },
);

app.listen(PORT, () => {
  console.log(
    chalk.magenta.bold(`🚀 Server flying at http://localhost:${PORT}`),
  );
});
