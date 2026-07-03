// Handles unknown API routes.
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
}
