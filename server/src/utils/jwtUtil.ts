import jwt from "jsonwebtoken";

const generateTokens = (id: string, email: string) => {
  const accessToken = jwt.sign(
    { id, email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id, email },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
  return { accessToken, refreshToken };
};

const isMyTokenValid = (token: string, secret: string) => {
  try {
    const decodedToken: any = jwt.verify(token, secret);
    return decodedToken || false;
  } catch (error) {
    return false;
  }
};

export { generateTokens, isMyTokenValid };
