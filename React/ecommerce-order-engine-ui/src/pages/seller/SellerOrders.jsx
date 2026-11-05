import {
  useEffect,
  useState,
} from "react";

import {
  getSellerOrders,
} from "../../services/orderApi";


function SellerOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * =========================================================
   * LOAD SELLER-OWNED ORDERS
   * ---------------------------------------------------------
   * No sellerId is sent from React.
   *
   * Backend resolves ownership from:
   *
   * JWT userId
   *    ↓
   * Seller
   *    ↓
   * Product ownership
   *    ↓
   * seller-owned order items
   * =========================================================
   */
  useEffect(() => {

    async function loadOrders() {

      try {

        setLoading(true);
        setError("");


        const data =
          await getSellerOrders();


        setOrders(
          data
        );

      } catch (error) {

        setError(
          error.message ||
          "Failed to load seller orders"
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


  if (loading) {

    return (

      <div>

        <div className="orders-header">

          <h1>
            My Orders
          </h1>

          <p>
            Loading seller orders...
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
          View orders containing products
          sold by your store.
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
              No Seller Orders
            </h2>

            <p>
              No customers have ordered
              your products yet.
            </p>

          </div>

        )}


      {orders.length > 0 && (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.orderId}
            >

              <div className="order-card-header">

                <div>

                  <p className="order-label">
                    ORDER
                  </p>

                  <h2>
                    #{order.orderId}
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
                    Your Subtotal
                  </span>

                  <strong className="order-total">
                    ₹{order.sellerSubtotal}
                  </strong>

                </div>

              </div>


              <div className="order-items-section">

                <h3>
                  Your Products
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


export default SellerOrders;