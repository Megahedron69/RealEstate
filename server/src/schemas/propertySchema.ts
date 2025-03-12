import { query, body, param } from "express-validator";

const allPropQuerySchema = [
  query("priceMin")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("priceMin must be a valid number"),
  query("priceMax")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("priceMax must be a valid number"),
  query("numBedrooms")
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("numBedrooms must be a positive integer"),
  query("numBathrooms")
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("numBathrooms must be a positive integer"),
  query("propertyType")
    .optional()
    .isIn(["APARTMENT", "HOUSE", "VILLA"])
    .withMessage("propertyType must be one of APARTMENT, HOUSE, or VILLA"),
  query("propertyStatus")
    .optional()
    .isIn(["AVAILABLE", "SOLD", "RENTED"])
    .withMessage("propertyStatus must be one of AVAILABLE, SOLD, or RENTED"),
  query("isRentable")
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage("isRentable must be a boolean value"),
  query("location")
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Invalid location format"),
  query("sortBy")
    .optional()
    .isIn(["price", "createdAt"])
    .withMessage("sortBy must be either price or createdAt"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be either asc or desc"),
  query("page")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("limit must be a positive integer"),
];

const propertySchema = [
  body("name").trim().notEmpty().withMessage("Name is required").escape(),
  body("description").optional().trim().escape(),
  body("price")
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("isRentable")
    .toBoolean()
    .isBoolean()
    .withMessage("isRentable must be a boolean"),
  body("propertyType")
    .isIn(["HOUSE", "VILLA", "APARTMENT"])
    .withMessage("Invalid property type"),
  body("numBedrooms")
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Bedrooms must be at least 1"),
  body("numBathrooms")
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Bathrooms must be at least 1"),
  body("numKitchens")
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Kitchens must be at least 1"),
  body("propertyStatus")
    .isIn(["AVAILABLE", "SOLD", "RENTED"])
    .withMessage("Invalid property status"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .escape(),
  body("latitude")
    .optional()
    .toFloat()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude value"),
  body("longitude")
    .optional()
    .toFloat()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude value"),
  body("areaSize")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Area size must be a positive number"),
  body("amenities")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (error) {
          throw new Error("Invalid amenities format");
        }
      }
      return value;
    })
    .isArray()
    .withMessage("Amenities must be an array"),
  body("images")
    .optional()
    .custom((value, { req }) => {
      if (!req.files || !req.files.images) return true;
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const image of images) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(image.mimetype)
        ) {
          throw new Error(
            "Invalid image format. Only JPG, PNG, and WEBP are allowed."
          );
        }
        if (image.size > 5 * 1024 * 1024) {
          throw new Error("Image size exceeds 5MB limit.");
        }
      }
      return true;
    }),
];

const propertyUpdateSchema = [
  body("name").optional().trim().escape(),
  body("description").optional().trim().escape(),
  body("price")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("isRentable")
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage("isRentable must be a boolean"),
  body("propertyType")
    .optional()
    .isIn(["HOUSE", "VILLA", "APARTMENT"])
    .withMessage("Invalid property type"),
  body("numBedrooms")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Bedrooms must be at least 1"),
  body("numBathrooms")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Bathrooms must be at least 1"),
  body("numKitchens")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Kitchens must be at least 1"),
  body("propertyStatus")
    .optional()
    .isIn(["AVAILABLE", "SOLD", "RENTED"])
    .withMessage("Invalid property status"),
  body("location").optional().trim().escape(),
  body("latitude")
    .optional()
    .toFloat()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude value"),
  body("longitude")
    .optional()
    .toFloat()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude value"),
  body("areaSize")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Area size must be a positive number"),
  body("amenities")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (error) {
          throw new Error("Invalid amenities format");
        }
      }
      return value;
    })
    .isArray()
    .withMessage("Amenities must be an array"),
  body("images")
    .optional()
    .custom((value, { req }) => {
      if (!req.files || !req.files.images) return true;
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const image of images) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(image.mimetype)
        ) {
          throw new Error(
            "Invalid image format. Only JPG, PNG, and WEBP are allowed."
          );
        }
        if (image.size > 5 * 1024 * 1024) {
          throw new Error("Image size exceeds 5MB limit.");
        }
      }
      return true;
    }),
];

export { allPropQuerySchema, propertySchema, propertyUpdateSchema };
