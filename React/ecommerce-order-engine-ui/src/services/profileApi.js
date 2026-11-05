import {
  authenticatedFetch,
} from "./apiClient";


const PROFILE_URL =
  "/api/profile/me";


/*
 * =========================================================
 * CURRENT USER PROFILE
 * ---------------------------------------------------------
 * Account identity always comes from the JWT.
 *
 * React does NOT send:
 *
 * userId
 * accountId
 * customerId
 * sellerId
 * =========================================================
 */
export async function getMyProfile() {

  const response =
    await authenticatedFetch(
      PROFILE_URL
    );


  if (!response.ok) {

    const message =
      await response.text();

    throw new Error(
      message ||
      "Failed to load profile"
    );
  }


  return response.json();
}