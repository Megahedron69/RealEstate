import { body } from "express-validator";

const validateChat = [
  body("receiverId").notEmpty().withMessage("Receiver ID is required"),
];

const validateMessage = [
  body("chatId").notEmpty().withMessage("Chat ID is required"),
  body("message").notEmpty().withMessage("Message cannot be empty"),
];

export { validateChat, validateMessage };
