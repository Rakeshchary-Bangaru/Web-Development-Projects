
import {
  NavLink,
  Outlet,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Users,
  Warehouse,
  ShoppingCart,
  UserCog,
  Headset,
  ArrowLeft,
} from "lucide-react";

import ProfileAvatar from "../components/ProfileAvatar";

function AdminLayout() {
  return (
    <div className="admin-layout">

      {/* ==========================================
          ROOT ADMINISTRATION SIDEBAR
         ========================================== */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          Admin Panel
        </div>

        <nav
          className="admin-nav"
          aria-label="ROOT administration navigation"
        >
          {/* MAIN ADMINISTRATION */}

          <NavLink to="/admin/dashboard">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/products">
            <Package size={19} />
            <span>Products</span>
          </NavLink>

          <NavLink to="/admin/customers">
            <Users size={19} />
            <span>Customers</span>
          </NavLink>

          <NavLink to="/admin/inventory">
            <Warehouse size={19} />
            <span>Inventory</span>
          </NavLink>

          <NavLink to="/admin/orders">
            <ShoppingCart size={19} />
            <span>Orders</span>
          </NavLink>

          {/* ACCOUNT ADMINISTRATION SECTION */}

          <div className="admin-nav-section-label">
            Account Administration
          </div>

          <NavLink to="/support/users">
            <UserCog size={19} />
            <span>User Management</span>
          </NavLink>

          <NavLink to="/support/dashboard">
            <Headset size={19} />
            <span>Support Dashboard</span>
          </NavLink>
        </nav>

        {/* ==========================================
            SIDEBAR FOOTER
           ========================================== */}
        <div className="admin-sidebar-footer">
          <NavLink
            to="/shop"
            className="back-to-shop"
          >
            <ArrowLeft size={17} />
            <span>Back to Store</span>
          </NavLink>
        </div>

      </aside>

      {/* ==========================================
          MAIN ADMIN CONTENT
         ========================================== */}
      <div className="admin-content">

        <header className="admin-topbar">
          <div className="admin-topbar-title">
            Administration
          </div>

          <ProfileAvatar />
        </header>

        <main className="admin-main">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
