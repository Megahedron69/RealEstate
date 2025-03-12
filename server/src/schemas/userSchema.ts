import { param, body } from "express-validator";

const validateUserIdSchema = [
  param("id").isUUID().withMessage("Invalid user ID format"),
];

const userUpdateSchema = [
  param("id").isUUID().withMessage("Invalid user ID format"),
  body("username")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .escape(),
  body("emailVerified")
    .optional()
    .isBoolean()
    .withMessage("emailVerified must be a boolean"),
  body("id").not().exists().withMessage("ID cannot be updated"),
  body("role").not().exists().withMessage("Role cannot be updated"),
  body("createdAt").not().exists().withMessage("createdAt cannot be updated"),
];

export { validateUserIdSchema, userUpdateSchema };
