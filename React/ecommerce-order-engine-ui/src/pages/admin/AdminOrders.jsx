import {
  Fragment,
  useEffect,
  useState,
} from "react";

import {
  getOrders,
  updateOrderStatus,
} from "../../services/orderApi";


function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [
    expandedOrderId,
    setExpandedOrderId,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  async function loadOrders() {

    try {

      setError("");

      const data =
        await getOrders();

      setOrders(data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadOrders();

  }, []);


  function handleViewItems(orderId) {

    if (
      expandedOrderId === orderId
    ) {

      setExpandedOrderId(null);

    } else {

      setExpandedOrderId(
        orderId
      );
    }
  }


  async function handleStatusUpdate(
    order
  ) {

    const newStatus =
      window.prompt(
        `Enter new status for Order ${order.id}`,
        order.status
      );


    if (newStatus === null) {
      return;
    }


    if (
      newStatus.trim() === ""
    ) {

      setError(
        "Please enter a valid order status"
      );

      return;
    }


    try {

      setError("");
      setMessage("");


      await updateOrderStatus(
        order.id,
        newStatus
          .trim()
          .toUpperCase()
      );


      setMessage(
        "Order status updated successfully"
      );


      await loadOrders();

    } catch (error) {

      setError(error.message);

    }
  }


  function formatDate(date) {

    if (!date) {
      return "";
    }


    return new Date(
      date
    ).toLocaleString();
  }


  function getStatusClass(status) {

    if (status === "PAID") {
      return "order-admin-status status-paid";
    }

    if (status === "PENDING") {
      return "order-admin-status status-pending";
    }

    if (status === "SHIPPED") {
      return "order-admin-status status-shipped";
    }

    if (status === "DELIVERED") {
      return "order-admin-status status-delivered";
    }

    if (
      status === "CANCELLED" ||
      status === "FAILED"
    ) {
      return "order-admin-status status-cancelled";
    }

    return "order-admin-status";
  }


  if (loading) {

    return (
      <p>
        Loading orders...
      </p>
    );
  }


  const totalRevenue =
    orders.reduce(
      (total, order) =>
        total +
        Number(order.total),
      0
    );


  const paidOrders =
    orders.filter(
      (order) =>
        order.status === "PAID"
    ).length;


  return (

    <div>

      {/* PAGE HEADER */}

      <div className="admin-page-header">

        <h1>
          Orders
        </h1>

        <p>
          View customer orders,
          payment details and
          manage order status.
        </p>

      </div>


      {/* SUCCESS */}

      {message && (

        <div className="success-message">
          {message}
        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* ORDER SUMMARY */}

      <div className="orders-admin-summary">

        <div className="dashboard-card">

          <p>
            Total Orders
          </p>

          <h2>
            {orders.length}
          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Paid Orders
          </p>

          <h2>
            {paidOrders}
          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Total Revenue
          </p>

          <h2>
            ₹{totalRevenue}
          </h2>

        </div>

      </div>


      {/* ORDER TABLE */}

      <div className="admin-card admin-table-card">

        <div className="admin-section-header">

          <div>

            <h2>
              Order List
            </h2>

            <p>
              {orders.length} orders
              currently available.
            </p>

          </div>

        </div>


        <div className="table-container">

          <table className="admin-table admin-orders-table">

            <thead>

              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Status
                </th>

                <th>
                  Created At
                </th>

                <th>
                  Total
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {orders.map(
                (order) => (

                  <Fragment
                    key={order.id}
                  >

                    <tr>

                      <td>

                        <strong>
                          #{order.id}
                        </strong>

                      </td>


                      <td>

                        <div className="admin-order-customer">

                          <strong>
                            {order.customerName}
                          </strong>

                          <span>
                            ID: {order.customerId}
                          </span>

                        </div>

                      </td>


                      <td>

                        <span className="payment-badge">
                          {order.paymentType}
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            getStatusClass(
                              order.status
                            )
                          }
                        >

                          <span className="status-dot"></span>

                          {order.status}

                        </span>

                      </td>


                      <td>
                        {formatDate(
                          order.createdAt
                        )}
                      </td>


                      <td className="admin-order-total">

                        ₹{order.total}

                      </td>


                      <td>

                        <div className="admin-action-buttons">

                          <button
                            className="admin-view-button"
                            onClick={() =>
                              handleViewItems(
                                order.id
                              )
                            }
                          >

                            {expandedOrderId ===
                            order.id
                              ? "Hide Items"
                              : "View Items"}

                          </button>


                          <button
                            className="admin-status-button"
                            onClick={() =>
                              handleStatusUpdate(
                                order
                              )
                            }
                          >
                            Update Status
                          </button>

                        </div>

                      </td>

                    </tr>


                    {expandedOrderId ===
                      order.id && (

                      <tr className="order-items-row">

                        <td colSpan="7">

                          <div className="admin-order-items">

                            <div className="order-items-header">

                              <h3>
                                Order Items
                              </h3>

                              <span>
                                Order #{order.id}
                              </span>

                            </div>


                            <table className="order-items-table">

                              <thead>

                                <tr>

                                  <th>
                                    Product ID
                                  </th>

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
                                        {item.productId}
                                      </td>

                                      <td>

                                        <strong>
                                          {
                                            item.productName
                                          }
                                        </strong>

                                      </td>

                                      <td>
                                        {item.quantity}
                                      </td>

                                      <td>

                                        ₹{
                                          item.subtotal
                                        }

                                      </td>

                                    </tr>

                                  )
                                )}

                              </tbody>

                            </table>

                          </div>

                        </td>

                      </tr>

                    )}

                  </Fragment>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


export default AdminOrders;