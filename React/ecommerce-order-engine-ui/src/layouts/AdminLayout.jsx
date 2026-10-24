import {
  NavLink,
  Outlet,
} from "react-router-dom";


function AdminLayout() {

  return (

    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          Admin Panel
        </div>


        <nav className="admin-nav">

          <NavLink
            to="/admin/dashboard"
          >
            Dashboard
          </NavLink>


          <NavLink
            to="/admin/products"
          >
            Products
          </NavLink>


          <NavLink
            to="/admin/customers"
          >
            Customers
          </NavLink>


          <NavLink
            to="/admin/inventory"
          >
            Inventory
          </NavLink>


          <NavLink
            to="/admin/orders"
          >
            Orders
          </NavLink>

        </nav>


        <div className="admin-sidebar-footer">

          <NavLink
            to="/shop"
            className="back-to-shop"
          >
            ← Back to Store
          </NavLink>

        </div>

      </aside>


      <main className="admin-main">

        <Outlet />

      </main>

    </div>
  );
}


export default AdminLayout;