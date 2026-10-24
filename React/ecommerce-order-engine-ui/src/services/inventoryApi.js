const BASE_URL = "/api/inventory";


export async function getStock(productId) {

  const response = await fetch(
    `${BASE_URL}/${productId}`
  );

  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to fetch stock"
    );
  }

  return response.json();
}


export async function setStock(
  productId,
  quantity
) {

  const response = await fetch(
    `${BASE_URL}/${productId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        quantity: quantity,
      }),
    }
  );


  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to set stock"
    );
  }


  return response.json();
}


export async function addStock(
  productId,
  quantity
) {

  const response = await fetch(
    `${BASE_URL}/${productId}/add`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        quantity: quantity,
      }),
    }
  );


  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to add stock"
    );
  }


  return response.json();
}