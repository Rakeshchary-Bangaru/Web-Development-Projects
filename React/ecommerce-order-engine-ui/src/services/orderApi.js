
import { authenticatedFetch } from "./apiClient";

const BASE_URL = "/api/orders";

const CUSTOMER_ORDERS_URL = "/api/customer/orders";

const SELLER_ORDERS_URL = "/api/seller/orders";

/*
 * =========================================================
 * HANDLE API ERRORS
 * =========================================================
 */
async function handleApiError(response, fallbackMessage) {
  let message = fallbackMessage;

  try {
    const contentType =
      response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await response.json();

      if (
        typeof body?.message === "string" &&
        body.message.trim()
      ) {
        message = body.message;
      } else if (
        typeof body?.error === "string" &&
        body.error.trim()
      ) {
        message = body.error;
      }
    } else {
      const text = await response.text();

      if (text && !text.trim().startsWith("<")) {
        message = text;
      }
    }
  } catch {
    // Use fallback message.
  }

  throw new Error(message);
}

/*
 * =========================================================
 * CUSTOMER — MY ORDERS
 * =========================================================
 *
 * Customer identity is resolved by the backend
 * from the authenticated JWT.
 *
 * Never send a customer ID to select another
 * account's orders.
 */
export async function getMyOrders() {
  const response = await authenticatedFetch(
    CUSTOMER_ORDERS_URL
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to fetch your orders"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * SELLER_ADMIN — MY ORDERS
 * =========================================================
 *
 * Seller identity comes from the JWT.
 * React does not supply a sellerId.
 */
export async function getSellerOrders() {
  const response = await authenticatedFetch(
    SELLER_ORDERS_URL
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to fetch seller orders"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * GLOBAL ORDER API
 * =========================================================
 *
 * Intended for ROOT administration.
 *
 * Existing API endpoints are preserved.
 * Backend authorization remains responsible for
 * restricting access to the appropriate roles.
 *
 * TODO:
 * Migrate to /api/root/orders when the backend
 * and frontend are updated together.
 */
export async function getOrders() {
  const response = await authenticatedFetch(
    BASE_URL
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to fetch orders"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * GET GLOBAL ORDER BY ID
 * =========================================================
 */
export async function getOrderById(id) {
  const response = await authenticatedFetch(
    `${BASE_URL}/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to fetch order"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * UPDATE GLOBAL ORDER STATUS
 * =========================================================
 */
export async function updateOrderStatus(id, status) {
  const response = await authenticatedFetch(
    `${BASE_URL}/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to update order status"
    );
  }

  // Preserve compatibility with endpoints returning
  // JSON or 204 No Content.
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
