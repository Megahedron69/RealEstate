import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import session from "express-session";
import "dotenv/config";

export const securityMiddleware = (app: any) => {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(
      helmet.hsts({
        maxAge: 15552000,
        includeSubDomains: true,
        preload: true,
      })
    );

    app.use((req: any, res: any, next: any) => {
      const isHttps =
        req.secure || req.headers["x-forwarded-proto"] === "https";
      if (!isHttps) {
        return res.redirect(`https://${req.headers.host}${req.url}`);
      }
      next();
    });
  }

  app.use(compression());
  app.use(hpp());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
      },
    })
  );
  app.disable("x-powered-by");
};
