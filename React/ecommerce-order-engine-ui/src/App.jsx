
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import SellerLayout from "./layouts/SellerLayout";
import SupportLayout from "./layouts/SupportLayout";

// Route protection
import ProtectedRoute from "./components/ProtectedRoute";

// Authentication
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GoogleAuthCallback from "./pages/auth/GoogleAuthCallback";
import AccessDenied from "./pages/auth/AccessDenied";

// ROOT administration
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminOrders from "./pages/admin/AdminOrders";

// Seller administration
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerOrders from "./pages/seller/SellerOrders";

// IT support
import SupportDashboard from "./pages/support/SupportDashboard";
import UserManagement from "./pages/support/UserManagement";

// Public storefront
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import MyOrders from "./pages/user/MyOrders";

// Shared account pages
import MyProfile from "./pages/profile/MyProfile";
import AccountSettings from "./pages/profile/AccountSettings";

// All four roles have normal shopping permissions.
const AUTHENTICATED_ROLES = [
  "CUSTOMER",
  "SELLER_ADMIN",
  "IT_SUPPORT",
  "ROOT",
];

const ROOT_ROLES = ["ROOT"];
const SELLER_ROLES = ["SELLER_ADMIN"];
const SUPPORT_ROLES = ["IT_SUPPORT", "ROOT"];

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={<Navigate to="/shop" replace />}
      />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/auth/google/callback"
        element={<GoogleAuthCallback />}
      />
      <Route
        path="/access-denied"
        element={<AccessDenied />}
      />

      {/* Public storefront */}
      <Route path="/shop" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="cart" element={<Cart />} />

        {/* Checkout and own orders: every signed-in role */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={AUTHENTICATED_ROLES}
            />
          }
        >
          <Route
            path="checkout"
            element={<Checkout />}
          />
          <Route
            path="orders"
            element={<MyOrders />}
          />
        </Route>
      </Route>

      {/* Shared account pages */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={AUTHENTICATED_ROLES}
          />
        }
      >
        <Route element={<UserLayout />}>
          <Route
            path="/profile"
            element={<MyProfile />}
          />
          <Route
            path="/account/settings"
            element={<AccountSettings />}
          />
        </Route>
      </Route>

      {/* ROOT administration */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={ROOT_ROLES}
          />
        }
      >
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={
              <Navigate to="dashboard" replace />
            }
          />
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="products"
            element={<AdminProducts />}
          />
          <Route
            path="customers"
            element={<AdminCustomers />}
          />
          <Route
            path="inventory"
            element={<AdminInventory />}
          />
          <Route
            path="orders"
            element={<AdminOrders />}
          />
          <Route
            path="profile"
            element={<MyProfile />}
          />
        </Route>
      </Route>

      {/* Seller administration */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={SELLER_ROLES}
          />
        }
      >
        <Route
          path="/seller"
          element={<SellerLayout />}
        >
          <Route
            index
            element={
              <Navigate to="dashboard" replace />
            }
          />
          <Route
            path="dashboard"
            element={<SellerDashboard />}
          />
          <Route
            path="products"
            element={<AdminProducts />}
          />
          <Route
            path="inventory"
            element={<AdminInventory />}
          />
          <Route
            path="orders"
            element={<SellerOrders />}
          />
          <Route
            path="profile"
            element={<MyProfile />}
          />
        </Route>
      </Route>

      {/* IT_SUPPORT and ROOT account administration */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={SUPPORT_ROLES}
          />
        }
      >
        <Route
          path="/support"
          element={<SupportLayout />}
        >
          <Route
            index
            element={
              <Navigate to="dashboard" replace />
            }
          />
          <Route
            path="dashboard"
            element={<SupportDashboard />}
          />
          <Route
            path="users"
            element={<UserManagement />}
          />
          <Route
            path="profile"
            element={<MyProfile />}
          />
        </Route>
      </Route>

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/shop" replace />}
      />
    </Routes>
  );
}

export default App;
