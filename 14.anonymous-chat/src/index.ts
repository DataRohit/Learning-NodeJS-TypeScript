import chalk from "chalk";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { nanoid } from "nanoid";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { Message, Session } from "./models/session.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("your_secret_here"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Anonymous User ID Middleware
app.use((req, res, next) => {
  if (!req.cookies.anonId) {
    const anonId = nanoid(10);
    res.cookie("anonId", anonId, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    (req as any).anonId = anonId;
  } else {
    (req as any).anonId = req.cookies.anonId;
  }
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  const code = nanoid(6).toUpperCase();
  const ownerId = (req as any).anonId;
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    await Session.create({ code, ownerId, expiresAt });
    res.redirect(`/chat/${code}`);
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

app.get("/join", (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.redirect("/");
  res.redirect(`/chat/${code.toUpperCase()}`);
});

app.get("/chat/:code", async (req, res) => {
  const { code } = req.params;
  const anonId = (req as any).anonId;

  try {
    const session = await Session.findOne({ code });
    if (!session) {
      return res.status(404).send("SESSION NOT FOUND OR EXPIRED");
    }

    const messages = await Message.find({ sessionCode: code }).sort({
      timestamp: 1,
    });

    res.render("chat", {
      code: session.code,
      userId: anonId,
      isOwner: session.ownerId === anonId,
      expiresAt: session.expiresAt.toISOString(),
      messages,
    });
  } catch (error) {
    res.redirect("/");
  }
});

// Socket logic
io.on("connection", (socket) => {
  let currentRoom: string | null = null;
  let currentUserId: string | null = null;

  socket.on("join-session", ({ code, userId }) => {
    currentRoom = code;
    currentUserId = userId;
    socket.join(code);
    socket.to(code).emit("user-joined", { userId });
    console.log(chalk.gray(`User ${userId} joined session ${code}`));
  });

  socket.on("send-message", async (data) => {
    const { code, userId, text } = data;

    try {
      const newMessage = await Message.create({
        sessionCode: code,
        senderId: userId,
        text,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      io.to(code).emit("receive-message", {
        senderId: userId,
        text,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("close-session", async ({ code, userId }) => {
    const session = await Session.findOne({ code });
    if (session && session.ownerId === userId) {
      await Session.deleteOne({ code });
      await Message.deleteMany({ sessionCode: code });
      io.to(code).emit("session-closed");
      console.log(chalk.red(`Session ${code} closed by owner`));
    }
  });

  socket.on("disconnect", () => {
    if (currentRoom && currentUserId) {
      socket.to(currentRoom).emit("user-left", { userId: currentUserId });
      console.log(
        chalk.gray(`User ${currentUserId} left session ${currentRoom}`),
      );
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(
    chalk.magenta.bold(`🚀 Server ready at http://localhost:${PORT}`),
  );
});
