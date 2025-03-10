import { type Request, type Response, type NextFunction } from "express";
import { ApiError } from "../middlewares/errorMiddleware";

export const getStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: "Everything working smooth",
      success: true,
    });
  } catch (err) {
    if (err instanceof Error) {
      next(new ApiError(500, err.message, [{ reason: "Random failure" }]));
    } else {
      next(
        new ApiError(500, "Unknown error occurred", [
          { reason: "Unexpected failure" },
        ])
      );
    }
  }
};
