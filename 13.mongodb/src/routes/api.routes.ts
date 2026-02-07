import { Response, Router } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, verifyJWTApi } from "../middlewares/auth.middleware.js";
import { Todo } from "../models/todo.model.js";
import { User } from "../models/user.model.js";

const router: Router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
};

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and Identity management
 *   - name: Todos
 *     description: Task management operations
 */

// --- AUTH ROUTES ---

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new developer account
 *     description: Creates a new user in the system. Checks for existing username or email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string, example: "johndoe" }
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "Secret123!" }
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value: { message: "User registered successfully", userId: "65c3b1e2a0f8b12345678901" }
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             examples:
 *               userExists:
 *                 value: { error: "User already exists" }
 *               validationError:
 *                 value: { error: "Registration failed" }
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser)
      return res.status(400).json({ error: "User already exists" });

    const user = await User.create({ username, email, password });
    return res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (_error) {
    return res.status(500).json({ error: "Registration failed" });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate and get tokens
 *     description: Validates user credentials and generates JWT access and refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "Secret123!" }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthSuccess' }
 *             examples:
 *               success:
 *                 value:
 *                   message: "Login successful"
 *                   accessToken: "eyJhbGciOiJIUzI1Ni..."
 *                   refreshToken: "eyJhbGciOiJIUzI1Ni..."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *             example: { error: "Invalid credentials" }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ message: "Login successful", accessToken, refreshToken });
  } catch (_error) {
    return res.status(500).json({ error: "Login failed" });
  }
});

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     description: Uses the refresh token from cookies to generate a new access token.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 *         content:
 *           application/json:
 *             example:
 *               message: "Token refreshed"
 *               accessToken: "new_access_token_here"
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh-token", async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken)
    return res.status(401).json({ error: "Refresh token missing" });

  try {
    const decoded: any = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    );
    const user = await User.findById(decoded?._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const accessToken = user.generateAccessToken();
    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .json({ message: "Token refreshed", accessToken });
  } catch (_error) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Terminate session
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             example: { message: "Logout successful" }
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/logout", verifyJWTApi, (_req, res) => {
  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({ message: "Logout successful" });
});

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get user profile
 *     description: Returns the full user object (excluding password).
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *             example:
 *               _id: "698749a504d9a03e0ba0f1cb"
 *               username: "johndoe"
 *               email: "john@example.com"
 *               createdAt: "2026-02-07T14:18:13.700Z"
 *               updatedAt: "2026-02-07T14:18:34.731Z"
 *               __v: 0
 *               refreshToken: "eyJhbGciOiJIUzI1Ni..."
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/me", verifyJWTApi, (req: AuthRequest, res) => {
  return res.json(req.user);
});

// --- TODO ROUTES ---

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Fetch all tasks
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Todo' }
 *             example:
 *               - _id: "65c3b1e2678905"
 *                 task: "Implement Swagger Docs"
 *                 completed: true
 *                 user: "65c3b1e2678900"
 *                 createdAt: "2026-02-07T14:20:00Z"
 *                 updatedAt: "2026-02-07T14:25:00Z"
 *                 __v: 0
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/todos", verifyJWTApi, async (req: AuthRequest, res) => {
  const todos = await Todo.find({ user: req.user?._id }).sort({
    createdAt: -1,
  });
  return res.json(todos);
});

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get single task
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "65c3b1e2678905" }
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Todo' }
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get("/todos/:id", verifyJWTApi, async (req: AuthRequest, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user?._id });
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  return res.json(todo);
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create new task
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [task]
 *             properties:
 *               task: { type: string, example: "Finish documenting the API" }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Todo' }
 *       400:
 *         description: Bad request
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/todos", verifyJWTApi, async (req: AuthRequest, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  const todo = await Todo.create({ user: req.user?._id, task });
  return res.status(201).json(todo);
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update task details
 *     description: Full update of a task's text or completion status.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "65c3b1e2678905" }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task: { type: string }
 *               completed: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Todo' }
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put("/todos/:id", verifyJWTApi, async (req: AuthRequest, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user?._id },
    req.body,
    { new: true },
  );
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  return res.json(todo);
});

/**
 * @swagger
 * /todos/{id}/toggle:
 *   patch:
 *     summary: Toggle completion status
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "65c3b1e2678905" }
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch(
  "/todos/:id/toggle",
  verifyJWTApi,
  async (req: AuthRequest, res: Response) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user?._id,
    });
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();
    return res.json(todo);
  },
);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Remove task
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "65c3b1e2678905" }
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  "/todos/:id",
  verifyJWTApi,
  async (req: AuthRequest, res: Response) => {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id,
    });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    return res.status(204).send();
  },
);

export default router;
