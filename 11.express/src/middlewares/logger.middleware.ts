import { NextFunction, Request, Response } from "express";

export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();
  const { method, url } = req;

  console.log(`[${timestamp}] ${method} ${url}`);

  next();
};
