import {
  useEffect,
  useState,
} from "react";

import {
  getProducts,
} from "../../services/productApi";

import {
  getCustomers,
} from "../../services/customerApi";

import {
  getOrders,
} from "../../services/orderApi";

import {
  getStock,
} from "../../services/inventoryApi";


function AdminDashboard() {

  const [stats, setStats] =
    useState({
      products: 0,
      customers: 0,
      orders: 0,
      revenue: 0,
      totalStock: 0,
      outOfStock: 0,
    });


  const [recentOrders, setRecentOrders] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  async function loadDashboard() {

    try {

      setError("");


      const [
        products,
        customers,
        orders,
      ] = await Promise.all([
        getProducts(),
        getCustomers(),
        getOrders(),
      ]);


      const inventory =
        await Promise.all(

          products.map(
            async (product) => {

              const stock =
                await getStock(
                  product.id
                );


              return {
                productId:
                  product.id,

                quantity:
                  stock.quantity,
              };

            }
          )

        );


      const totalRevenue =
        orders.reduce(
          (total, order) =>
            total +
            Number(order.total),

          0
        );


      const totalStock =
        inventory.reduce(
          (total, item) =>
            total +
            Number(item.quantity),

          0
        );


      const outOfStock =
        inventory.filter(
          (item) =>
            Number(item.quantity) === 0
        ).length;


      setStats({
        products:
          products.length,

        customers:
          customers.length,

        orders:
          orders.length,

        revenue:
          totalRevenue,

        totalStock:
          totalStock,

        outOfStock:
          outOfStock,
      });


      const sortedOrders =
        [...orders]
          .sort(
            (a, b) =>
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
          )
          .slice(0, 5);


      setRecentOrders(
        sortedOrders
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadDashboard();

  }, []);


  function formatDate(date) {

    if (!date) {
      return "";
    }


    return new Date(
      date
    ).toLocaleString();
  }


  if (loading) {

    return (

      <p>
        Loading dashboard...
      </p>

    );
  }


  return (

    <div>

      {/* PAGE HEADER */}

      <div className="admin-page-header">

        <h1>
          Dashboard
        </h1>

        <p>
          Overview of products,
          customers, orders and
          inventory.
        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* DASHBOARD STATISTICS */}

      <div className="dashboard-grid">


        <div className="dashboard-card">

          <p>
            Total Products
          </p>

          <h2>
            {stats.products}
          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Total Customers
          </p>

          <h2>
            {stats.customers}
          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Total Orders
          </p>

          <h2>
            {stats.orders}
          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Total Revenue
          </p>

          <h2>
            ₹{stats.revenue}
          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Total Stock
          </p>

          <h2>
            {stats.totalStock}
          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Out of Stock
          </p>

          <h2
            className={
              stats.outOfStock > 0
                ? "dashboard-warning"
                : ""
            }
          >
            {stats.outOfStock}
          </h2>

        </div>

      </div>


      {/* RECENT ORDERS */}

      <div className="admin-card dashboard-orders">

        <div className="dashboard-section-header">

          <div>

            <h2>
              Recent Orders
            </h2>

            <p>
              Latest orders placed
              by customers.
            </p>

          </div>

        </div>


        {recentOrders.length === 0 ? (

          <p>
            No orders available.
          </p>

        ) : (

          <div className="table-container">

            <table>

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
                    Total
                  </th>

                  <th>
                    Created At
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentOrders.map(
                  (order) => (

                    <tr key={order.id}>

                      <td>
                        #{order.id}
                      </td>


                      <td>
                        {order.customerName}
                      </td>


                      <td>
                        {order.paymentType}
                      </td>


                      <td>

                        <span
                          className={
                            order.status === "PAID"
                              ? "admin-status paid-admin-status"
                              : "admin-status"
                          }
                        >

                          <span className="status-dot">

                          </span>

                          {order.status}

                        </span>

                      </td>


                      <td>
                        ₹{order.total}
                      </td>


                      <td>

                        {formatDate(
                          order.createdAt
                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}


export default AdminDashboard;