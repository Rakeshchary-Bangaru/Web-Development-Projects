
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  UserRound,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ProfileAvatar from "../components/ProfileAvatar";

function SellerLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="admin-layout">
      {/* SELLER SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          Seller Panel
        </div>

        <nav
          className="admin-nav"
          aria-label="Seller navigation"
        >
          <NavLink to="/seller/dashboard">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/seller/products">
            <Package size={19} />
            <span>My Products</span>
          </NavLink>

          <NavLink to="/seller/inventory">
            <Warehouse size={19} />
            <span>My Inventory</span>
          </NavLink>

          <NavLink to="/seller/orders">
            <ShoppingCart size={19} />
            <span>My Orders</span>
          </NavLink>

          <div className="admin-nav-section-label">
            My Account
          </div>

          <NavLink to="/seller/profile">
            <UserRound size={19} />
            <span>My Profile</span>
          </NavLink>

          <NavLink to="/account/settings">
            <Settings size={19} />
            <span>Account Settings</span>
          </NavLink>
        </nav>

        {/* SELLER SIDEBAR FOOTER */}
        <div className="admin-sidebar-footer">
          {currentUser?.email && (
            <p className="seller-account-email">
              {currentUser.email}
            </p>
          )}

          <NavLink
            to="/shop"
            className="back-to-shop"
          >
            <ArrowLeft size={17} />
            <span>Back to Store</span>
          </NavLink>

          <button
            type="button"
            className="secondary-button seller-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* SELLER CONTENT */}
      <div className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            Seller Administration
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

export default SellerLayout;
