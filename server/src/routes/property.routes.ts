import { Router } from "express";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  allPropQuerySchema,
  propertySchema,
  propertyUpdateSchema,
} from "../schemas/propertySchema";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getAllProperties,
  getPropertyById,
  createAproperty,
  updateProperty,
  deleteProperty,
} from "../controllers/properties.controller";
import { asyncHandler } from "../middlewares/asynMiddleware";
import { validateUserIdSchema } from "../schemas/userSchema";

export const propertyRouter = Router();

propertyRouter.get(
  "/",
  validateRequest(allPropQuerySchema),
  asyncHandler(getAllProperties)
);
propertyRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(validateUserIdSchema),
  asyncHandler(getPropertyById)
);

propertyRouter.post(
  "/createProperty",
  authMiddleware,
  validateRequest(propertySchema),
  asyncHandler(createAproperty)
);
propertyRouter.patch(
  "/:id",
  authMiddleware,
  validateRequest(propertyUpdateSchema),
  asyncHandler(updateProperty)
);

propertyRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest(validateUserIdSchema),
  asyncHandler(deleteProperty)
);
