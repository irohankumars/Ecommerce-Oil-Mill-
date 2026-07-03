// Validation chains for wishlist routes.
import { body, param } from "express-validator";

export const wishlistBodyValidator = [body("productId").isMongoId().withMessage("Valid product id is required.")];
export const wishlistParamValidator = [param("productId").isMongoId().withMessage("Valid product id is required.")];
