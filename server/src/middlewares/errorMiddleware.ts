import type { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

class ApiError extends Error {
  public statusCode: number;
  public errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors || [];
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || undefined;

  logger.error(`[${req.method}] ${req.url} - ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export { errorHandler, ApiError };
