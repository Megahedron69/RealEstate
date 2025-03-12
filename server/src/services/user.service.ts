import prisma from "../config/prisma";
import { ApiError } from "../middlewares/errorMiddleware";

const getAllUsersService = async () => {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  } catch (error: any) {
    throw new ApiError(500, "Failed to get all Users ", [
      { reason: error.message },
    ]);
  }
};

const getUserByIdService = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  } catch (error: any) {
    throw new ApiError(500, "Failed to get User with id", [
      { reason: error.message },
    ]);
  }
};

const updateUserService = async (id: string, updateData: any) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }
    return await prisma.user.update({
      where: { id },
      data: {
        username: updateData.username || existingUser.username,
        emailVerified:
          updateData.emailVerified !== undefined
            ? updateData.emailVerified
            : existingUser.emailVerified,
        role: updateData.role || existingUser.role,
        updatedAt: new Date(),
      },
    });
  } catch (error: any) {
    throw new ApiError(500, "Failed to update user", [
      { reason: error.message },
    ]);
  }
};

const deleteUserService = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    await prisma.user.delete({ where: { id } });
  } catch (error: any) {
    throw new ApiError(500, "Failed to delete user", [
      { reason: error.message },
    ]);
  }
};

export {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};
