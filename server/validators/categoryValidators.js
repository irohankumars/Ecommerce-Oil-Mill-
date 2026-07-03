// Validation chains for category routes.
import { body, param } from "express-validator";

export const categoryIdValidator = [param("id").isMongoId().withMessage("Valid category id is required.")];

export const categoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required."),
  body("slug").optional().trim().isSlug().withMessage("Slug must be URL friendly."),
  body("image").optional().trim().isURL().withMessage("Image must be a URL."),
  body("description").optional().trim(),
];
