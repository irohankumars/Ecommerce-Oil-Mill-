// Authentication business logic.
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";

export async function registerUser(payload) {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new ApiError("Email is already registered.", 409);
  const user = await User.create(payload);
  const token = signToken(user._id);
  return { user, token };
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError("Invalid email or password.", 401);
  }
  const token = signToken(user._id);
  user.password = undefined;
  return { user, token };
}

export async function updateUserProfile(userId, payload) {
  const allowed = ["name", "phone", "addresses"];
  const updates = Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));
  return User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
}
