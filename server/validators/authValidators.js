// Validation chains for authentication routes.
import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  body("phone").optional().trim().isLength({ min: 7 }).withMessage("Phone number is too short."),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

export const updateProfileValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("phone").optional().trim().isLength({ min: 7 }).withMessage("Phone number is too short."),
  body("addresses").optional().isArray().withMessage("Addresses must be an array."),
];
