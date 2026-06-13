import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  console.error("Error:", err);

  let statusCode = 500;
  let message = "Internal server error";
  let stack;

  if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err
  ) {
    statusCode = (err as { statusCode?: number }).statusCode || 500;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? stack : undefined,
  });
};