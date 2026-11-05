
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  UserRound,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ProfileAvatar from "../components/ProfileAvatar";

function SupportLayout() {
  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();

  /*
   * =========================================================
   * ROLE CHECK
   * =========================================================
   *
   * ROOT can access both the Admin and Support panels.
   * IT_SUPPORT can access only authorized support routes.
   */
  const isRoot = currentUser?.role === "ROOT";

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   *
   * Clear the frontend JWT and authentication state,
   * then redirect to the login page.
   */
  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="admin-layout support-layout">

      {/* =====================================================
          IT SUPPORT SIDEBAR
         ===================================================== */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          IT Support
        </div>

        {/* ===================================================
            SUPPORT NAVIGATION
           =================================================== */}
        <nav
          className="admin-nav"
          aria-label="IT Support navigation"
        >

          <NavLink to="/support/dashboard">
            <LayoutDashboard
              size={19}
              aria-hidden="true"
            />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/support/users">
            <Users
              size={19}
              aria-hidden="true"
            />
            <span>User Accounts</span>
          </NavLink>

          {/* ===============================================
              MY ACCOUNT
             =============================================== */}
          <div className="admin-nav-section-label">
            My Account
          </div>

          <NavLink to="/support/profile">
            <UserRound
              size={19}
              aria-hidden="true"
            />
            <span>My Profile</span>
          </NavLink>

          <NavLink to="/account/settings">
            <Settings
              size={19}
              aria-hidden="true"
            />
            <span>Account Settings</span>
          </NavLink>

          {/* ===============================================
              ROOT-ONLY ADMINISTRATION
             =============================================== */}
          {isRoot && (
            <>
              <div className="admin-nav-section-label">
                ROOT Administration
              </div>

              <NavLink
                to="/admin/dashboard"
                className="support-root-link"
              >
                <ShieldCheck
                  size={19}
                  aria-hidden="true"
                />
                <span>Admin Dashboard</span>
              </NavLink>
            </>
          )}

        </nav>

        {/* ===================================================
            SIDEBAR FOOTER
           =================================================== */}
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
            <ArrowLeft
              size={17}
              aria-hidden="true"
            />
            <span>Back to Store</span>
          </NavLink>

          <button
            type="button"
            className="secondary-button seller-logout-button"
            onClick={handleLogout}
          >
            <LogOut
              size={17}
              aria-hidden="true"
            />
            <span>Sign Out</span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          SUPPORT MAIN CONTENT
         ===================================================== */}
      <div className="admin-content">

        {/* TOP NAVIGATION */}
        <header className="admin-topbar">

          <div className="admin-topbar-title">
            Support Administration
          </div>

          {/* SHARED PROFILE MENU */}
          <ProfileAvatar />

        </header>

        {/* NESTED SUPPORT ROUTES */}
        <main className="admin-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default SupportLayout;
