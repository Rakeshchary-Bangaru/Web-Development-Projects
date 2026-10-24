const BASE_URL = "/api/orders";


export async function getOrders() {

  const response = await fetch(BASE_URL);

  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to fetch orders"
    );
  }

  return response.json();
}


export async function getOrderById(id) {

  const response = await fetch(
    `${BASE_URL}/${id}`
  );

  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to fetch order"
    );
  }

  return response.json();
}


export async function updateOrderStatus(
  id,
  status
) {

  const response = await fetch(
    `${BASE_URL}/${id}/status`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status: status,
      }),
    }
  );


  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to update order status"
    );
  }


  return response.json();
}