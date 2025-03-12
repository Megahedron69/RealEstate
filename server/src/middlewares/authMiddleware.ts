import type { Response, NextFunction } from "express";
import { isMyTokenValid } from "../utils/jwtUtil";
import { ApiError } from "./errorMiddleware";
import type { AuthenticatedRequest } from "../types/customTypes";
import prisma from "../config/prisma";

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new ApiError(401, "Unauthorized: No token provided");
    const decoded = isMyTokenValid(token, process.env.ACCESS_TOKEN_SECRET!);
    if (!decoded || !decoded.id) throw new ApiError(401, "Invalid token");

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new ApiError(404, "User not found");
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
