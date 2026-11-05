
import { authenticatedFetch } from "./apiClient";

const BASE_URL = "/api/customers";

/*
 * =========================================================
 * ERROR HANDLING
 * =========================================================
 *
 * Preserve helpful backend errors without exposing
 * raw HTML or unexpected responses to the user.
 */
async function handleApiError(response, fallbackMessage) {
  let message = fallbackMessage;

  try {
    const contentType =
      response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await response.json();

      if (typeof body?.message === "string" && body.message.trim()) {
        message = body.message;
      } else if (typeof body?.error === "string" && body.error.trim()) {
        message = body.error;
      }
    } else {
      const text = await response.text();

      if (text && !text.trim().startsWith("<")) {
        message = text;
      }
    }
  } catch {
    // Keep the fallback error message.
  }

  throw new Error(message);
}

/*
 * =========================================================
 * GET ALL CUSTOMERS
 * ROOT / authorized administrative access only.
 * =========================================================
 */
export async function getCustomers() {
  const response = await authenticatedFetch(BASE_URL);

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to fetch customers"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * GET CUSTOMER BY ID
 * =========================================================
 */
export async function getCustomerById(id) {
  const response = await authenticatedFetch(
    `${BASE_URL}/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to fetch customer"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * CREATE CUSTOMER
 * =========================================================
 */
export async function createCustomer(customer) {
  const response = await authenticatedFetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to create customer"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * UPDATE CUSTOMER
 * =========================================================
 */
export async function updateCustomer(id, customer) {
  const response = await authenticatedFetch(
    `${BASE_URL}/${encodeURIComponent(id)}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(customer),
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to update customer"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * UPDATE CUSTOMER EMAIL
 * =========================================================
 */
export async function updateCustomerEmail(id, email) {
  const response = await authenticatedFetch(
    `${BASE_URL}/${encodeURIComponent(id)}/email`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to update customer email"
    );
  }

  return response.json();
}

/*
 * =========================================================
 * DELETE CUSTOMER
 * =========================================================
 */
export async function deleteCustomer(id) {
  const response = await authenticatedFetch(
    `${BASE_URL}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    await handleApiError(
      response,
      "Failed to delete customer"
    );
  }

  // DELETE may return 204 No Content.
  // Preserve the existing function contract.
}
