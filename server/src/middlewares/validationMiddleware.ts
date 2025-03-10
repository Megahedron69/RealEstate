import { validationResult, type ValidationError } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorMiddleware";

export const validateRequest = (schema: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(schema.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new ApiError(
          400,
          "Validation failed",
          errors.array().map((err: ValidationError) => ({
            field: "any",
            message: err.msg,
          }))
        )
      );
    }

    next();
  };
};
