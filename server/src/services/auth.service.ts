import prisma from "../config/prisma";
import * as argon2 from "argon2";
import { ApiError } from "../middlewares/errorMiddleware";
import { generateTokens, isMyTokenValid } from "../utils/jwtUtil";

const createUser = async (
  email: string,
  password: string,
  username?: string | null
) => {
  try {
    const isExistingUser = await prisma.user.findUnique({ where: { email } });
    if (isExistingUser) throw new ApiError(400, "email already in use");
    else {
      const hashedPassword = await argon2.hash(password);
      const user = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: hashedPassword,
        },
      });
      return user;
    }
  } catch (error: any) {
    throw new ApiError(500, "Failed to create user", [
      { reason: error.message },
    ]);
  }
};

const saveRefreshToken = async (userId: string, refreshToken: string) => {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken } });
};

const verifyUser = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(401, "Invalid credentials");
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");
    return user;
  } catch (error: any) {
    throw new ApiError(500, "Failed to create user", [
      { reason: error.message },
    ]);
  }
};

const refreshTokenService = async (refreshToken: string) => {
  try {
    if (!refreshToken) throw new ApiError(403, "refresh token missing");
    const decodedToken = isMyTokenValid(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );
    if (!decodedToken) throw new ApiError(403, "Invalid refresh token");
    if (!decodedToken.id) throw new ApiError(403, "Invalid refresh payload");
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });
    if (!user) throw new ApiError(404, "user not found");
    const { accessToken, refreshToken: refreshTokenNew } = generateTokens(
      user.id,
      user.email
    );
    await saveRefreshToken(user.id, refreshTokenNew);
    return { accessToken, refreshToken: refreshTokenNew };
  } catch (error: any) {
    throw new ApiError(500, "Unable to refresh token", [
      { reason: error.message },
    ]);
  }
};

const logoutService = async (userId: string) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  } catch (error: any) {
    throw new ApiError(500, "Logout failed", [{ reason: error.message }]);
  }
};

export {
  createUser,
  verifyUser,
  refreshTokenService,
  saveRefreshToken,
  logoutService,
};
