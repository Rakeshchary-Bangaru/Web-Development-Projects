import { useEffect, useState } from "react";

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

  const [stats, setStats] = useState({
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

      // Get products, customers and orders
      // at the same time
      const [
        products,
        customers,
        orders,
      ] = await Promise.all([
        getProducts(),
        getCustomers(),
        getOrders(),
      ]);


      // Get inventory for every product
      const inventory =
        await Promise.all(

          products.map(async (product) => {

            const stock =
              await getStock(product.id);

            return {
              productId: product.id,
              quantity: stock.quantity,
            };

          })

        );


      // Calculate total revenue
      const totalRevenue =
        orders.reduce(
          (total, order) =>
            total + Number(order.total),
          0
        );


      // Calculate total inventory quantity
      const totalStock =
        inventory.reduce(
          (total, item) =>
            total + item.quantity,
          0
        );


      // Products with zero stock
      const outOfStock =
        inventory.filter(
          (item) =>
            item.quantity === 0
        ).length;


      setStats({
        products: products.length,
        customers: customers.length,
        orders: orders.length,
        revenue: totalRevenue,
        totalStock: totalStock,
        outOfStock: outOfStock,
      });


      // Latest 5 orders
      const sortedOrders =
        [...orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          )
          .slice(0, 5);


      setRecentOrders(sortedOrders);

    } catch (error) {

      setError(error.message);

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

    return new Date(date)
      .toLocaleString();
  }


  if (loading) {

    return (
      <p>Loading dashboard...</p>
    );
  }


  return (

    <div>

      <h1>Admin Dashboard</h1>


      {error && (
        <p>{error}</p>
      )}


      <h2>Overview</h2>


      <div>

        <div>
          <h3>Total Products</h3>
          <p>{stats.products}</p>
        </div>


        <div>
          <h3>Total Customers</h3>
          <p>{stats.customers}</p>
        </div>


        <div>
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>


        <div>
          <h3>Total Revenue</h3>
          <p>
            ₹{stats.revenue}
          </p>
        </div>


        <div>
          <h3>Total Stock</h3>
          <p>{stats.totalStock}</p>
        </div>


        <div>
          <h3>Out of Stock</h3>
          <p>{stats.outOfStock}</p>
        </div>

      </div>


      <h2>Recent Orders</h2>


      {recentOrders.length === 0 ? (

        <p>No orders available.</p>

      ) : (

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
                    {order.id}
                  </td>

                  <td>
                    {order.customerName}
                  </td>

                  <td>
                    {order.paymentType}
                  </td>

                  <td>
                    {order.status}
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

      )}

    </div>
  );
}


export default AdminDashboard;