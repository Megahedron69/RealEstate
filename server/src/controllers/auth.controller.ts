import type { Request, Response, NextFunction } from "express";
import {
  createUser,
  logoutService,
  refreshTokenService,
  saveRefreshToken,
  verifyUser,
} from "../services/auth.service";
import { generateTokens, isMyTokenValid } from "../utils/jwtUtil";
import { ApiError } from "../middlewares/errorMiddleware";

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;
    const user = await createUser(email, password, username);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await verifyUser(email, password);
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);
    await saveRefreshToken(user.id, refreshToken);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new ApiError(401, "User not logged in");
    const decodedToken = isMyTokenValid(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );
    if (!decodedToken || !decodedToken.id)
      throw new ApiError(403, "Incorrect token payload");
    await logoutService(decodedToken.id);
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ success: "true", message: "Logged out successfully" });
  } catch (error: any) {
    next(error);
  }
};

const refreshAccToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshTok = req.cookies.refresh_token;
    const { accessToken, refreshToken } = await refreshTokenService(refreshTok);
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, accessToken });
  } catch (error: any) {
    next(error);
  }
};

export { loginUser, logoutUser, signUpUser, refreshAccToken };
