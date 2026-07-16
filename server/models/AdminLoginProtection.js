// Temporary admin login protection state with automatic expiry.
import mongoose from "mongoose";

const adminLoginProtectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    ip: { type: String, trim: true },
    fingerprint: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    failedAttempts: { type: Number, default: 0 },
    lockCount: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    lastAttemptAt: { type: Date },
    attemptedEmails: [{ type: String, lowercase: true, trim: true }],
    captchaQuestion: { type: String },
    captchaAnswer: { type: String, select: false },
    captchaExpires: { type: Date },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 60 * 60 * 1000), index: { expires: 0 } },
  },
  { timestamps: true }
);

adminLoginProtectionSchema.index({ ip: 1, updatedAt: -1 });
adminLoginProtectionSchema.index({ fingerprint: 1, updatedAt: -1 });

export default mongoose.model("AdminLoginProtection", adminLoginProtectionSchema);
