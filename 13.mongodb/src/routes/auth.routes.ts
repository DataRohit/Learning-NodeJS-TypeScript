import { Router } from "express";
import { User } from "../models/user.model.js";

const router: Router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
};

// Render Register Page
router.get("/register", (_req, res) => {
  res.render("register");
});

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser)
      return res.render("register", { error: "User already exists" });

    await User.create({ username, email, password });
    res.redirect("/login");
  } catch (error) {
    res.render("register", { error: "Registration failed" });
  }
});

// Render Login Page
router.get("/login", (_req, res) => {
  res.render("login");
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .redirect("/");
  } catch (error) {
    res.render("login", { error: "Login failed" });
  }
});

// Logout User
router.post("/logout", async (_req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.redirect("/login");
});

export default router;
