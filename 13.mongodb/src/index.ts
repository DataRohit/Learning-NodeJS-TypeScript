import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import path from "path";
import * as redoc from "redoc-express";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { swaggerSpec } from "./config/swagger.js";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/schema.js";
import { User } from "./models/user.model.js";
import apiRoutes from "./routes/api.routes.js";
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

const httpServer = http.createServer(app);

// Apollo Server Setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

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
app.use("/api/v1", apiRoutes);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redoc Documentation
app.get(
  "/redoc",
  (redoc as any).default({
    title: "TaskMaster API - Redoc",
    specUrl: "/openapi.json",
  }),
);

// OpenAPI JSON Endpoint
app.get("/openapi.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// GraphQL Middleware
app.use(
  "/graphql",
  cors({ origin: true, credentials: true }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!token) return {};

      try {
        const decodedToken: any = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
        );
        const user = await User.findById(decodedToken?._id).select("-password");
        return { user };
      } catch (_error) {
        return {};
      }
    },
  }),
);

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

httpServer.listen(PORT, () => {
  console.log(
    chalk.magenta.bold(`🚀 Server ready at http://localhost:${PORT}`),
  );
  console.log(
    chalk.cyan.bold(`📚 Swagger UI:   http://localhost:${PORT}/api-docs`),
  );
  console.log(
    chalk.blue.bold(`📖 Redoc:        http://localhost:${PORT}/redoc`),
  );
  console.log(
    chalk.green.bold(`📄 OpenAPI JSON: http://localhost:${PORT}/openapi.json`),
  );
  console.log(
    chalk.yellow.bold(`🕸️  GraphQL Play: http://localhost:${PORT}/graphql`),
  );
});
