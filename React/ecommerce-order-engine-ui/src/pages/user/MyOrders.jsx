import {
  useEffect,
  useState,
} from "react";

import {
  getMyOrders,
} from "../../services/orderApi";


function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * =========================================================
   * LOAD AUTHENTICATED CUSTOMER ORDERS
   * ---------------------------------------------------------
   * No customerId is requested from the user.
   *
   * The backend resolves ownership using:
   *
   * JWT userId
   *    ↓
   * linked Customer
   *    ↓
   * customer's orders
   * =========================================================
   */
  useEffect(() => {

    async function loadOrders() {

      try {

        setLoading(true);
        setError("");


        const customerOrders =
          await getMyOrders();


        /*
         * Backend already returns newest orders first,
         * but keeping the frontend sort makes the UI
         * defensive if ordering changes later.
         */
        const sortedOrders =
          [...customerOrders].sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          );


        setOrders(
          sortedOrders
        );

      } catch (error) {

        setError(
          error.message ||
          "Failed to load your orders"
        );

      } finally {

        setLoading(false);

      }
    }


    loadOrders();

  }, []);


  function formatDate(date) {

    if (!date) {
      return "";
    }


    return new Date(date)
      .toLocaleString();
  }


  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */
  if (loading) {

    return (

      <div>

        <div className="orders-header">

          <h1>
            My Orders
          </h1>

          <p>
            Loading your orders...
          </p>

        </div>

      </div>
    );
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


      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {!error &&
        orders.length === 0 && (

          <div className="no-orders">

            <div className="no-orders-icon">
              📦
            </div>

            <h2>
              No Orders Found
            </h2>

            <p>
              You have not placed any orders yet.
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

                  <span className="status-dot">
                  </span>

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