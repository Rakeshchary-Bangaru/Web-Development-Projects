import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div>
      <h2>Admin Panel</h2>

      <nav>
        <Link to="/admin">Dashboard</Link>{" | "}
        <Link to="/admin/products">Products</Link>{" | "}
        <Link to="/admin/customers">Customers</Link>{" | "}
        <Link to="/admin/inventory">Inventory</Link>{" | "}
        <Link to="/admin/orders">Orders</Link>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

export default AdminLayout;