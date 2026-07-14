// Handles client-side security telemetry.
import { apiRequest } from "../api/apiClient.js";

export function reportSecurityActivity(signal) {
  return apiRequest("/security/activity", { method: "POST", body: JSON.stringify({ signal }) });
}
