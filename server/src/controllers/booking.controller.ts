import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/customTypes";
import {
  createBookingService,
  getUserBookingsService,
  getUserOffersService,
  updateBookingStatusService,
} from "../services/booking.service";
import { ApiError } from "../middlewares/errorMiddleware";

const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "User not found");
    }
    const { propertyId, transactionType, amount } = req.body;
    const booking = await createBookingService(
      userId,
      propertyId,
      transactionType,
      amount
    );
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "User not found");
    }
    const bookings = await getUserBookingsService(userId);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

const getUserOffers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "User not found");
    }
    const offers = await getUserOffersService(userId);
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const booking = await updateBookingStatusService(bookingId, status);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export { createBooking, getUserBookings, getUserOffers, updateBookingStatus };
