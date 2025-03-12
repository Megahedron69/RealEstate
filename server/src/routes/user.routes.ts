import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asynMiddleware";
import { validateUserIdSchema, userUpdateSchema } from "../schemas/userSchema";
import { validateRequest } from "../middlewares/validationMiddleware";

export const userRouter = express.Router();

userRouter.get("/", authMiddleware, asyncHandler(getAllUsers));
userRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(validateUserIdSchema),
  asyncHandler(getUserById)
);
userRouter.patch(
  "/:id",
  authMiddleware,
  validateRequest(userUpdateSchema),
  asyncHandler(updateUser)
);
userRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest(validateUserIdSchema),
  asyncHandler(deleteUser)
);
