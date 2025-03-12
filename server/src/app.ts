import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";

import "dotenv/config";

import logger from "./config/logger";
import { securityMiddleware } from "./middlewares/securityMiddleware";
import { authLimiter, generalLimiter } from "./config/rateLimiter";
import { errorHandler } from "./middlewares/errorMiddleware";

import { statusRouter } from "./routes/status.routes";
import { authRouter } from "./routes/auth.routes";
import { propertyRouter } from "./routes/property.routes";
import { userRouter } from "./routes/user.routes";
import { bookingRouter } from "./routes/booking.routes";
import { fileUploadMiddleware } from "./config/expressFileUpload";

const PORT: string | number = process.env.PORT || 3001;
const app: Application = express();
const BV = process.env.BACKEND_VER || "/api/v1";
const server = app.listen(PORT, () => {
  logger.info(`✅ Server running securely on port ${PORT}`);
});

securityMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUploadMiddleware);
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.url} - ${req.ip}`);
  next();
});

app.use(generalLimiter);

app.use(`${BV}`, statusRouter);
app.use(`${BV}/user`, userRouter);
app.use(`${BV}/user/auth`, authLimiter, authRouter);
app.use(`${BV}/properties`, propertyRouter);
app.use(`${BV}/bookings`, bookingRouter);
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);
const shutdown = async () => {
  logger.info("🔻 Server shutting down gracefully...");
  server.close(() => {
    logger.info("🚀 Server stopped.");
    process.exit(0);
  });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
