import { validationResult, type ValidationError } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorMiddleware";

export const validateRequest = (
  schemas: any[],
  target: "body" | "query" = "body"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run validation on the specified target (body or query)
    await Promise.all(schemas.map((validation) => validation.run(req)));

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
