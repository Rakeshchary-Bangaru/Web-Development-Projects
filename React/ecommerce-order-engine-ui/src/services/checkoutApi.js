import {
  authenticatedFetch,
} from "./apiClient";


const BASE_URL = "/api/checkout";


export async function checkout(
  checkoutRequest
) {

  const response =
    await authenticatedFetch(
      BASE_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(
          checkoutRequest
        ),
      }
    );


  if (!response.ok) {

    const message =
      await response.text();

    throw new Error(
      message ||
      "Checkout failed"
    );
  }


  return response.json();
}