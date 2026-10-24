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


    const id = Number(customerId);


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

      <div className="orders-header">

        <h1>
          My Orders
        </h1>

        <p>
          View your previous purchases,
          payment details and order status.
        </p>

      </div>


      <form
        className="orders-search-form"
        onSubmit={handleSearch}
      >

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
            placeholder="Enter your customer ID"
            required
          />

        </div>


        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Loading..."
            : "View Orders"}

        </button>

      </form>


      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {searched &&
        orders.length === 0 && (

          <div className="no-orders">

            <div className="no-orders-icon">
              📦
            </div>

            <h2>
              No Orders Found
            </h2>

            <p>
              We couldn't find any orders
              for this customer.
            </p>

          </div>

        )}


      {orders.length > 0 && (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <div className="order-card-header">

                <div>

                  <p className="order-label">
                    ORDER
                  </p>

                  <h2>
                    #{order.id}
                  </h2>

                </div>


                <span
                  className={
                    order.status === "PAID"
                      ? "order-status paid-order-status"
                      : "order-status"
                  }
                >

                  <span className="status-dot"></span>

                  {order.status}

                </span>

              </div>


              <div className="order-details-grid">

                <div>

                  <span>
                    Customer
                  </span>

                  <strong>
                    {order.customerName}
                  </strong>

                </div>


                <div>

                  <span>
                    Payment
                  </span>

                  <strong>
                    {order.paymentType}
                  </strong>

                </div>


                <div>

                  <span>
                    Date
                  </span>

                  <strong>
                    {formatDate(
                      order.createdAt
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Total
                  </span>

                  <strong className="order-total">
                    ₹{order.total}
                  </strong>

                </div>

              </div>


              <div className="order-items-section">

                <h3>
                  Order Items
                </h3>


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
                          key={item.productId}
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

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}


export default MyOrders;