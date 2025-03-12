import { Router } from "express";
import { getStatus } from "../controllers/status.controller";
export const statusRouter = Router();

statusRouter.get("/status", getStatus);
