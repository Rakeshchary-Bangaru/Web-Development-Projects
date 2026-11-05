
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  allowedRoles = [],
}) {
  const {
    isAuthenticated,
    currentUser,
    loading,
  } = useAuth();

  const location = useLocation();

  // Wait for authentication restoration.
  if (loading) {
    return (
      <p>Checking authentication...</p>
    );
  }

  // Guests must log in before accessing
  // protected customer or administration routes.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // Authenticated users must have a permitted role.
  const hasAccess =
    allowedRoles.length === 0 ||
    allowedRoles.includes(currentUser?.role);

  if (!hasAccess) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{
          attemptedPath: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
