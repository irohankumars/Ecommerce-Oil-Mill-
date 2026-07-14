// Handles authenticated customer account API calls.
import { API_ENDPOINTS } from "../constants/apiConfig.js";
import { apiRequest } from "../api/apiClient.js";

export function fetchAccountProfile() {
  return apiRequest(API_ENDPOINTS.auth.profile);
}

export function updateAccountProfile(payload) {
  return apiRequest(API_ENDPOINTS.auth.profile, { method: "PUT", body: JSON.stringify(payload) });
}

export function changeAccountPassword(payload) {
  return apiRequest(API_ENDPOINTS.auth.changePassword, { method: "PUT", body: JSON.stringify(payload) });
}

export function addAccountAddress(payload) {
  return apiRequest(API_ENDPOINTS.auth.addresses, { method: "POST", body: JSON.stringify(payload) });
}

export function updateAccountAddress(id, payload) {
  return apiRequest(API_ENDPOINTS.auth.address(id), { method: "PUT", body: JSON.stringify(payload) });
}

export function deleteAccountAddress(id) {
  return apiRequest(API_ENDPOINTS.auth.address(id), { method: "DELETE" });
}
