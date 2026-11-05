
import {
  Link,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function AccessDenied() {
  const location = useLocation();
  const { currentUser } = useAuth();

  const attemptedPath =
    location.state?.attemptedPath;

  const isCheckout =
    attemptedPath === "/shop/checkout";

  const isOrders =
    attemptedPath === "/shop/orders";

  return (
    <div
      className="login-page"
      style={{ padding: "48px 16px" }}
    >
      <div
        className="admin-card"
        style={{
          maxWidth: 540,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1>Access Restricted</h1>

        {isCheckout || isOrders ? (
          <>
            <p>
              Checkout and order history are
              available to CUSTOMER accounts only.
            </p>

            <p>
              You are currently signed in as{" "}
              <strong>
                {currentUser?.role || "Unknown"}
              </strong>.
            </p>

            <p>
              To place an order, sign out and
              sign in using a CUSTOMER account.
            </p>
          </>
        ) : (
          <p>
            Your account does not have permission
            to access this page.
          </p>
        )}

        <Link
          to="/shop"
          className="primary-button"
          style={{
            display: "inline-block",
            marginTop: 20,
            textDecoration: "none",
          }}
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
