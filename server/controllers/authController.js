// Auth controller exposes account and session endpoints.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { setAuthCookie } from "../utils/jwt.js";
import { registerUser, loginUser, updateUserProfile } from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, 201, "Registered successfully", { user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, 200, "Logged in successfully", { user, token });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  sendSuccess(res, 200, "Logged out successfully");
});

export const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Profile fetched successfully", { user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user._id, req.body);
  sendSuccess(res, 200, "Profile updated successfully", { user });
});
