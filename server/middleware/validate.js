// Converts express-validator failures into API errors.
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((error) => ({ field: error.path, message: error.msg }));
  next(new ApiError("Validation failed.", 422, errors));
}
