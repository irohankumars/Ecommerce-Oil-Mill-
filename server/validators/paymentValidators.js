// Validation chains for payment placeholders.
import { body } from "express-validator";

export const paymentIntentValidator = [
  body("orderId").optional().isMongoId().withMessage("Valid order id is required."),
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be positive."),
];
