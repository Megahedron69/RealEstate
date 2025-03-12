import type { Request, Response, NextFunction } from "express";
import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../services/user.service";
import { ApiError } from "../middlewares/errorMiddleware";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUserService(id, req.body);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteUserService(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { getAllUsers, getUserById, updateUser, deleteUser };
