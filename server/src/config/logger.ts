import winston from "winston";
import path from "path";
import "dotenv/config";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
    }),
  ],
});

export default logger;
