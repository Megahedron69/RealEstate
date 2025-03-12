import { Router } from "express";
import { validateRequest } from "../middlewares/validationMiddleware";
import { loginSchema, signupSchema } from "../schemas/authSchema";
import {
  loginUser,
  logoutUser,
  refreshAccToken,
  signUpUser,
} from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/asynMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

export const authRouter = Router();

authRouter.post(
  "/signUp",
  validateRequest(signupSchema),
  asyncHandler(signUpUser)
);

authRouter.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(loginUser)
);
authRouter.post("/logout", authMiddleware, asyncHandler(logoutUser));
authRouter.post("/refreshToken", asyncHandler(refreshAccToken));
