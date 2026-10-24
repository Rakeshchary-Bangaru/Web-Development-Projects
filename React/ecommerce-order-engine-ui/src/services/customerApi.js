const BASE_URL = "/api/customers";


export async function getCustomers() {

  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return response.json();
}


export async function getCustomerById(id) {

  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch customer");
  }

  return response.json();
}


export async function createCustomer(customer) {

  const response = await fetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(customer),
  });


  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to create customer"
    );
  }


  return response.json();
}


export async function updateCustomer(id, customer) {

  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(customer),
    }
  );


  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to update customer"
    );
  }


  return response.json();
}


export async function updateCustomerEmail(id, email) {

  const response = await fetch(
    `${BASE_URL}/${id}/email`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
      }),
    }
  );


  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to update customer email"
    );
  }


  return response.json();
}


export async function deleteCustomer(id) {

  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "DELETE",
    }
  );


  if (!response.ok) {

    const message = await response.text();

    throw new Error(
      message || "Failed to delete customer"
    );
  }
}