import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  createBooking,
  getUserBookings,
  getUserOffers,
  updateBookingStatus,
} from "../controllers/booking.controller";
import { bookingValidation } from "../schemas/bookingSchema";
import { asyncHandler } from "../middlewares/asynMiddleware";

const bookingRouter = express.Router();

bookingRouter.post(
  "/",
  authMiddleware,
  validateRequest(bookingValidation),
  asyncHandler(createBooking)
);

bookingRouter.get("/", authMiddleware, asyncHandler(getUserBookings));
bookingRouter.get("/:offers", authMiddleware, asyncHandler(getUserOffers));
bookingRouter.patch(
  "/:bookingId",
  authMiddleware,
  asyncHandler(updateBookingStatus)
);

export { bookingRouter };
