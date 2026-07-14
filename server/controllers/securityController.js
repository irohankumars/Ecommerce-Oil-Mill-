// Security controller records suspicious frontend activity signals.
import SecurityEvent from "../models/SecurityEvent.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { logSecurityEvent } from "../services/securityEventService.js";

const restrictionWindowMs = 72 * 60 * 60 * 1000;
const suspiciousThreshold = 5;

export const reportSuspiciousActivity = asyncHandler(async (req, res) => {
  await logSecurityEvent(req, "suspicious_client_activity", { signal: req.body.signal }, "medium");
  const since = new Date(Date.now() - restrictionWindowMs);
  const query = { type: "suspicious_client_activity", createdAt: { $gte: since } };
  if (req.user?._id) query.user = req.user._id;
  else query.ip = req.ip;
  const count = await SecurityEvent.countDocuments(query);
  const restrictedUntil = count >= suspiciousThreshold ? new Date(Date.now() + restrictionWindowMs).toISOString() : null;
  sendSuccess(res, 200, "Security event recorded", { restricted: Boolean(restrictedUntil), restrictedUntil, count });
});
