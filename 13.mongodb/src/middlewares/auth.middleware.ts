import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/user.model.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const verifyJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.redirect("/login");
    }

    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      return res.redirect("/login");
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.redirect("/login");
  }
};

export const verifyJWTApi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    req.user = user as IUser;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
