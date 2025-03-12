import prisma from "../config/prisma";
import { ApiError } from "../middlewares/errorMiddleware";
import type {
  TransactionType,
  PropStatus,
  BookingStatus,
} from "@prisma/client";

const createBookingService = async (
  userId: string,
  propertyId: string,
  transactionType: TransactionType,
  amount: number
) => {
  try {
    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      throw new ApiError(404, "Property not found");
    }
    if (property.propertyStatus === "SOLD") {
      throw new ApiError(400, "Property is already sold and cannot be booked");
    }
    const booking = await prisma.transactions.create({
      data: {
        userId,
        propertyId,
        transactionType,
        amount,
        status: "PENDING",
      },
    });
    return booking;
  } catch (error: any) {
    throw new ApiError(500, "Failed to create booking", [
      { reason: error.message },
    ]);
  }
};

const getUserBookingsService = async (userId: string) => {
  try {
    return await prisma.transactions.findMany({
      where: { userId },
      include: {
        property: true,
      },
      orderBy: { transactionDate: "desc" },
    });
  } catch (error: any) {
    throw new ApiError(500, "Failed to fetch bookings", [
      { reason: error.message },
    ]);
  }
};

const getUserOffersService = async (userId: string) => {
  try {
    return await prisma.transactions.findMany({
      where: {
        property: {
          listingCreatedBy: userId,
        },
        status: "PENDING",
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        property: true,
      },
      orderBy: { transactionDate: "desc" },
    });
  } catch (error: any) {
    throw new ApiError(500, "Failed to fetch received offers", [
      { reason: error.message },
    ]);
  }
};

const updateBookingStatusService = async (
  bookingId: string,
  status: "ACCEPTED" | "REJECTED"
) => {
  try {
    const booking = await prisma.transactions.update({
      where: { id: bookingId },
      data: { status },
    });
    if (status === "ACCEPTED") {
      await prisma.properties.update({
        where: { id: booking.propertyId },
        data: { propertyStatus: "SOLD" },
      });
    }
    return booking;
  } catch (error: any) {
    throw new ApiError(500, "Failed to update booking status", [
      { reason: error.message },
    ]);
  }
};

export {
  createBookingService,
  getUserBookingsService,
  getUserOffersService,
  updateBookingStatusService,
};
