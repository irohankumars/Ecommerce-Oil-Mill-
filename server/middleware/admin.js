// Restricts routes to admin users.
import { ApiError } from "../utils/ApiError.js";

export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return next(new ApiError("Admin access required.", 403));
  }
  next();
}
