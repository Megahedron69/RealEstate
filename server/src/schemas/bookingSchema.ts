import { body } from "express-validator";

export const bookingValidation = [
  body("propertyId").isUUID().withMessage("Invalid property ID format"),
  body("transactionType")
    .isIn(["BUY", "SELL", "RENT"])
    .withMessage("Transaction type must be BUY, SELL, or RENT"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
];
