
import { useEffect, useState } from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  ShoppingCart,
  House,
  Package,
  LogIn,
  LogOut,
  UserRound,
  LayoutDashboard,
  ClipboardList,
  UsersRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import ProfileAvatar from "./ProfileAvatar";

import "../styles/components/MobileNavbar.css";

/*
 * =========================================================
 * DASHBOARD ROUTES
 * =========================================================
 */

const dashboardPaths = {
  ROOT: "/admin/dashboard",
  SELLER_ADMIN: "/seller/dashboard",
  IT_SUPPORT: "/support/dashboard",
};

/*
 * =========================================================
 * NAVBAR
 * =========================================================
 */

function Navbar() {
  const {
    isAuthenticated,
    currentUser,
    loading,
    logout,
  } = useAuth();

  const { cartItems } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * =======================================================
   * CART COUNT
   * =======================================================
   */

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + (Number(item.cartQuantity) || 0),
    0
  );

  /*
   * =======================================================
   * SHOPPING ACCESS
   * =======================================================
   *
   * Every authenticated role can shop:
   *
   * CUSTOMER
   * SELLER_ADMIN
   * IT_SUPPORT
   * ROOT
   *
   * Administrative roles provide additional permissions,
   * not restrictions on shopping.
   */

  const canViewOwnOrders =
    isAuthenticated && Boolean(currentUser);

  /*
   * ROOT and IT_SUPPORT can access user/role management.
   *
   * Spring Boot must independently enforce ROLE_MANAGE.
   */

  const canManageUsers =
    isAuthenticated &&
    ["ROOT", "IT_SUPPORT"].includes(
      currentUser?.role
    );

  const dashboardPath =
    dashboardPaths[currentUser?.role];

  /*
   * =======================================================
   * MOBILE MENU
   * =======================================================
   */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      closeOnEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        closeOnEscape
      );
    };
  }, [menuOpen]);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/shop", { replace: true });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="shop-navbar shop-navbar-v11">
      {/* ============================================= */}
      {/* STORE LOGO */}
      {/* ============================================= */}

      <NavLink
        to="/shop"
        className="shop-logo"
        onClick={closeMenu}
      >
        E-Commerce Store
      </NavLink>

      {/* ============================================= */}
      {/* DESKTOP NAVIGATION */}
      {/* ============================================= */}

      <nav
        className="shop-nav-links v11-desktop-nav"
        aria-label="Desktop store navigation"
      >
        {/* HOME */}

        <NavLink
          to="/shop"
          end
          className="shop-nav-item"
        >
          <House size={19} strokeWidth={2} />
          <span>Home</span>
        </NavLink>

        {/* PRODUCTS */}

        <NavLink
          to="/shop/products"
          className="shop-nav-item"
        >
          <Package size={19} strokeWidth={2} />
          <span>Products</span>
        </NavLink>

        {/* CART: ALL USERS */}

        <NavLink
          to="/shop/cart"
          className="shop-nav-item cart-link"
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <ShoppingCart size={19} strokeWidth={2} />

          <span>Cart</span>

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </NavLink>

        {/* OWN ORDERS: ALL AUTHENTICATED ROLES */}

        {!loading && canViewOwnOrders && (
          <NavLink
            to="/shop/orders"
            className="shop-nav-item"
          >
            <ClipboardList
              size={19}
              strokeWidth={2}
            />

            <span>My Orders</span>
          </NavLink>
        )}

        {/* ACCOUNT / LOGIN */}

        {!loading &&
          (isAuthenticated ? (
            <div className="shop-account-menu">
              <ProfileAvatar />
            </div>
          ) : (
            <NavLink
              to="/login"
              className="shop-login-button"
            >
              <LogIn
                size={18}
                strokeWidth={2}
              />

              <span>Login</span>
            </NavLink>
          ))}
      </nav>

      {/* ============================================= */}
      {/* MOBILE HEADER ACTIONS */}
      {/* ============================================= */}

      <div className="v11-mobile-actions">
        <NavLink
          to="/shop/cart"
          className="v11-mobile-cart"
          aria-label={`Cart, ${cartCount} items`}
          onClick={closeMenu}
        >
          <ShoppingCart size={22} />

          {cartCount > 0 && (
            <span className="v11-mobile-badge">
              {cartCount}
            </span>
          )}
        </NavLink>

        <button
          type="button"
          className="v11-menu-button"
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="v11-mobile-navigation"
        >
          {menuOpen ? (
            <X
              size={24}
              strokeWidth={2.4}
            />
          ) : (
            <Menu
              size={24}
              strokeWidth={2.4}
            />
          )}
        </button>
      </div>

      {/* ============================================= */}
      {/* MOBILE DROPDOWN PANEL */}
      {/* ============================================= */}

      <nav
        id="v11-mobile-navigation"
        className={`v11-mobile-panel ${
          menuOpen
            ? "v11-mobile-panel-open"
            : ""
        }`}
        aria-label="Mobile store navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="v11-menu-heading">
          MENU
        </div>

        {/* HOME */}

        <NavLink
          to="/shop"
          end
          onClick={closeMenu}
          className="v11-mobile-link"
        >
          <House size={19} />
          <span>Home</span>
        </NavLink>

        {/* PRODUCTS */}

        <NavLink
          to="/shop/products"
          onClick={closeMenu}
          className="v11-mobile-link"
        >
          <Package size={19} />
          <span>Products</span>
        </NavLink>

        {/* CART */}

        <NavLink
          to="/shop/cart"
          onClick={closeMenu}
          className="v11-mobile-link"
        >
          <ShoppingCart size={19} />
          <span>Cart</span>

          {cartCount > 0 && (
            <span className="v11-menu-count">
              {cartCount}
            </span>
          )}
        </NavLink>

        {/* MY ORDERS: ALL AUTHENTICATED ROLES */}

        {!loading && canViewOwnOrders && (
          <NavLink
            to="/shop/orders"
            onClick={closeMenu}
            className="v11-mobile-link"
          >
            <ClipboardList size={19} />

            <span>My Orders</span>
          </NavLink>
        )}

        {/* AUTHENTICATED ACCOUNT MENU */}

        {!loading && isAuthenticated && (
          <>
            <div className="v11-menu-divider" />

            {/* ROLE DASHBOARD */}

            {dashboardPath && (
              <NavLink
                to={dashboardPath}
                onClick={closeMenu}
                className="v11-mobile-link"
              >
                <LayoutDashboard size={19} />

                <span>Dashboard</span>
              </NavLink>
            )}

            {/* USER / ROLE MANAGEMENT */}

            {canManageUsers && (
              <NavLink
                to="/support/users"
                onClick={closeMenu}
                className="v11-mobile-link"
              >
                <UsersRound size={19} />

                <span>User & Role Management</span>
              </NavLink>
            )}

            {/* MY PROFILE */}

            <NavLink
              to="/profile"
              onClick={closeMenu}
              className="v11-mobile-link"
            >
              <UserRound size={19} />

              <span>My Profile</span>
            </NavLink>

            {/* LOGOUT */}

            <button
              type="button"
              className="v11-mobile-link v11-logout-link"
              onClick={handleLogout}
            >
              <LogOut size={19} />

              <span>Logout</span>
            </button>
          </>
        )}

        {/* GUEST LOGIN */}

        {!loading && !isAuthenticated && (
          <>
            <div className="v11-menu-divider" />

            <NavLink
              to="/login"
              onClick={closeMenu}
              className="v11-mobile-login"
            >
              <LogIn size={19} />

              <span>Login</span>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
