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

  const [orders, setOrders] = useState([]);

  const [expandedOrderId, setExpandedOrderId] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");


  async function loadOrders() {

    try {

      setError("");

      const data = await getOrders();

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

    if (expandedOrderId === orderId) {

      setExpandedOrderId(null);

    } else {

      setExpandedOrderId(orderId);

    }
  }


  async function handleStatusUpdate(order) {

    const newStatus = window.prompt(
      `Enter new status for Order ${order.id}`,
      order.status
    );


    if (newStatus === null) {
      return;
    }


    if (newStatus.trim() === "") {

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
        newStatus.trim()
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

    return new Date(date)
      .toLocaleString();
  }


  if (loading) {

    return <p>Loading orders...</p>;
  }


  return (

    <div>

      <h1>Orders</h1>


      {message && (
        <p>{message}</p>
      )}


      {error && (
        <p>{error}</p>
      )}


      <h2>Order List</h2>


      <table>

        <thead>

          <tr>

            <th>Order ID</th>

            <th>Customer</th>

            <th>Payment</th>

            <th>Status</th>

            <th>Created At</th>

            <th>Total</th>

            <th>Actions</th>

          </tr>

        </thead>


        <tbody>

          {orders.map((order) => (

            <Fragment key={order.id}>
              <tr key={order.id}>

                <td>
                  {order.id}
                </td>

                <td>
                  {order.customerName}
                  {" "}
                  ({order.customerId})
                </td>

                <td>
                  {order.paymentType}
                </td>

                <td>
                  {order.status}
                </td>

                <td>
                  {formatDate(
                    order.createdAt
                  )}
                </td>

                <td>
                  ₹{order.total}
                </td>

                <td>

                  <button
                    onClick={() =>
                      handleViewItems(
                        order.id
                      )
                    }
                  >

                    {expandedOrderId === order.id
                      ? "Hide Items"
                      : "View Items"}

                  </button>

                  {" "}

                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        order
                      )
                    }
                  >
                    Update Status
                  </button>

                </td>

              </tr>


              {expandedOrderId ===
                order.id && (

                <tr
                  key={`${order.id}-items`}
                >

                  <td colSpan="7">

                    <h3>
                      Order Items
                    </h3>


                    <table>

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
                                {
                                  item.productId
                                }
                              </td>

                              <td>
                                {
                                  item.productName
                                }
                              </td>

                              <td>
                                {
                                  item.quantity
                                }
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

                  </td>

                </tr>

              )}

            </Fragment>

          ))}

        </tbody>

      </table>

    </div>
  );
}


export default AdminOrders;