import {
  authenticatedFetch,
} from "./apiClient";


const BASE_URL = "/api/products";


export async function getProducts() {

  const response =
    await fetch(BASE_URL);


  if (!response.ok) {

    throw new Error(
      "Failed to fetch products"
    );
  }


  return response.json();
}


export async function createProduct(
  product
) {

  const response =
    await authenticatedFetch(
      BASE_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          product
        ),
      }
    );


  if (!response.ok) {

    const message =
      await response.text();

    throw new Error(
      message ||
      "Failed to create product"
    );
  }


  return response.json();
}


export async function updateProduct(
  id,
  product
) {

  const response =
    await authenticatedFetch(
      `${BASE_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          product
        ),
      }
    );


  if (!response.ok) {

    const message =
      await response.text();

    throw new Error(
      message ||
      "Failed to update product"
    );
  }


  return response.json();
}


export async function updateProductPrice(
  id,
  price
) {

  const response =
    await authenticatedFetch(
      `${BASE_URL}/${id}/price`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          price,
        }),
      }
    );


  if (!response.ok) {

    const message =
      await response.text();

    throw new Error(
      message ||
      "Failed to update product price"
    );
  }


  return response.json();
}


export async function deleteProduct(
  id
) {

  const response =
    await authenticatedFetch(
      `${BASE_URL}/${id}`,
      {
        method: "DELETE",
      }
    );


  if (!response.ok) {

    const message =
      await response.text();

    throw new Error(
      message ||
      "Failed to delete product"
    );
  }
}

export async function getSellerProducts() {

  const response =
    await authenticatedFetch(
      "/api/seller/products"
    );


  if (!response.ok) {

    const message =
      await response.text();

    throw new Error(
      message ||
      "Failed to fetch seller products"
    );
  }


  return response.json();
}