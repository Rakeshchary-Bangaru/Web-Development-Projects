import { useState } from "react";

import {
  getOrders,
} from "../../services/orderApi";


function MyOrders() {

  const [customerId, setCustomerId] =
    useState("");

  const [orders, setOrders] =
    useState([]);

  const [searched, setSearched] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSearch(event) {

    event.preventDefault();

    setError("");
    setSearched(false);


    const id =
      Number(customerId);


    if (
      Number.isNaN(id) ||
      id <= 0
    ) {

      setError(
        "Please enter a valid customer ID"
      );

      return;
    }


    try {

      setLoading(true);


      const allOrders =
        await getOrders();


      const customerOrders =
        allOrders
          .filter(
            (order) =>
              order.customerId === id
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          );


      setOrders(customerOrders);

      setSearched(true);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  function formatDate(date) {

    if (!date) {
      return "";
    }

    return new Date(date)
      .toLocaleString();
  }


  return (

    <div>

      <h1>My Orders</h1>


      <form onSubmit={handleSearch}>

        <div>

          <label htmlFor="customerId">
            Customer ID
          </label>

          <input
            id="customerId"
            type="number"
            value={customerId}
            onChange={(event) =>
              setCustomerId(
                event.target.value
              )
            }
            required
          />

        </div>


        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Loading..."
            : "View Orders"}

        </button>

      </form>


      {error && (
        <p>{error}</p>
      )}


      {searched &&
        orders.length === 0 && (

          <p>
            No orders found for this customer.
          </p>

        )}


      {orders.length > 0 && (

        <div>

          <h2>Order History</h2>


          {orders.map((order) => (

            <div key={order.id}>

              <h3>
                Order #{order.id}
              </h3>


              <p>
                Customer:{" "}
                {order.customerName}
              </p>


              <p>
                Payment:{" "}
                {order.paymentType}
              </p>


              <p>
                Status:{" "}
                {order.status}
              </p>


              <p>
                Date:{" "}
                {formatDate(
                  order.createdAt
                )}
              </p>


              <p>
                Total: ₹{order.total}
              </p>


              <h4>Items</h4>


              <table>

                <thead>

                  <tr>

                    <th>
                      Product
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Subtotal
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {order.items.map(
                    (item) => (

                      <tr
                        key={
                          item.productId
                        }
                      >

                        <td>
                          {item.productName}
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          ₹{item.subtotal}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

              <hr />

            </div>

          ))}

        </div>

      )}

    </div>
  );
}


export default MyOrders;