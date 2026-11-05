
import { useState } from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "../../styles/components/Login.css";

/*
 * =========================================================
 * CONFIGURATION
 * =========================================================
 */

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const GOOGLE_OAUTH_ENABLED =
  import.meta.env.VITE_GOOGLE_OAUTH_ENABLED === "true";

const GOOGLE_RETURN_PATH_KEY =
  "googleOAuthReturnPath";

/*
 * =========================================================
 * AUTHENTICATED SHOPPING ROLES
 * =========================================================
 *
 * Every role can shop and access its own orders.
 *
 * Administrative permissions remain separate.
 */

const SHOPPING_ROLES = new Set([
  "CUSTOMER",
  "SELLER_ADMIN",
  "IT_SUPPORT",
  "ROOT",
]);

/*
 * =========================================================
 * ALLOWED RETURN PATHS
 * =========================================================
 *
 * Only explicitly approved shopping destinations can
 * be restored after authentication.
 *
 * Prevent arbitrary or external redirects.
 */

const ALLOWED_SHOPPING_PATHS = new Set([
  "/shop/checkout",
  "/shop/orders",
]);

/*
 * =========================================================
 * DEFAULT DESTINATION
 * =========================================================
 *
 * After normal login, every role lands on the storefront
 * unless a valid shopping destination was requested.
 */

function destinationForRole() {
  return "/shop";
}

/*
 * =========================================================
 * EXTRACT SAFE REQUESTED PATH
 * =========================================================
 */

function extractRequestedPath(from) {
  if (!from) {
    return null;
  }

  const pathname =
    typeof from === "string"
      ? from.split(/[?#]/, 1)[0]
      : from.pathname;

  if (
    typeof pathname !== "string" ||
    !ALLOWED_SHOPPING_PATHS.has(pathname)
  ) {
    return null;
  }

  return pathname;
}

/*
 * =========================================================
 * RESOLVE POST-LOGIN DESTINATION
 * =========================================================
 *
 * All four authenticated roles can return to checkout
 * and their own order history.
 *
 * Do not redirect to arbitrary URLs.
 */

function resolveReturnPath(from, role) {
  const requestedPath = extractRequestedPath(from);

  if (
    SHOPPING_ROLES.has(role) &&
    requestedPath
  ) {
    return requestedPath;
  }

  return destinationForRole();
}

/*
 * =========================================================
 * LOGIN PAGE
 * =========================================================
 */

function Login() {
  const {
    login,
    isAuthenticated,
    currentUser,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * =======================================================
   * REGISTRATION SUCCESS
   * =======================================================
   */

  const registrationSuccess =
    location.state?.registrationSuccess === true;

  /*
   * =======================================================
   * RETURN PATH
   * =======================================================
   *
   * Examples:
   *
   * Guest -> Cart -> Login -> Checkout
   *
   * Guest -> My Orders -> Login -> My Orders
   *
   * ROOT, SELLER_ADMIN, IT_SUPPORT and CUSTOMER
   * are all eligible for these shopping routes.
   */

  const requestedLocation =
    location.state?.from;

  const requestedPath =
    extractRequestedPath(requestedLocation);

  const isCheckoutRedirect =
    requestedPath === "/shop/checkout";

  const isOrdersRedirect =
    requestedPath === "/shop/orders";

  /*
   * =======================================================
   * GOOGLE RECAPTCHA ENTERPRISE
   * =======================================================
   */

  async function generateRecaptchaToken() {
    if (!RECAPTCHA_SITE_KEY) {
      throw new Error(
        "reCAPTCHA site key is not configured"
      );
    }

    if (
      !window.grecaptcha ||
      !window.grecaptcha.enterprise
    ) {
      throw new Error(
        "reCAPTCHA is not available"
      );
    }

    return new Promise((resolve, reject) => {
      window.grecaptcha.enterprise.ready(
        async () => {
          try {
            const token =
              await window.grecaptcha.enterprise.execute(
                RECAPTCHA_SITE_KEY,
                {
                  action: "login",
                }
              );

            if (!token) {
              throw new Error(
                "Unable to generate reCAPTCHA token"
              );
            }

            resolve(token);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  /*
   * =======================================================
   * EMAIL / PASSWORD LOGIN
   * =======================================================
   */

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading || authLoading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      /*
       * Generate a fresh reCAPTCHA token.
       */

      const recaptchaToken =
        await generateRecaptchaToken();

      /*
       * Authenticate using Spring Boot.
       *
       * AuthContext handles JWT storage and user state.
       */

      const authenticatedUser = await login(
        email,
        password,
        recaptchaToken
      );

      /*
       * Return to checkout or own orders for any
       * authenticated shopping role.
       */

      const destination = resolveReturnPath(
        requestedLocation,
        authenticatedUser.role
      );

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * =======================================================
   * GOOGLE OAUTH2 LOGIN
   * =======================================================
   *
   * Spring Boot handles the Google authorization flow.
   *
   * React saves only a safe shopping destination,
   * then redirects to the backend OAuth2 entry point.
   */

  function handleGoogleLogin() {
    if (
      !GOOGLE_OAUTH_ENABLED ||
      loading ||
      authLoading
    ) {
      return;
    }

    setError("");

    /*
     * Preserve checkout or own-orders navigation
     * across the Google OAuth2 redirect.
     *
     * Do not store arbitrary redirect destinations.
     */

    if (requestedPath) {
      sessionStorage.setItem(
        GOOGLE_RETURN_PATH_KEY,
        requestedPath
      );
    } else {
      sessionStorage.removeItem(
        GOOGLE_RETURN_PATH_KEY
      );
    }

    window.location.assign(
      "/oauth2/authorization/google"
    );
  }

  /*
   * =======================================================
   * AUTHENTICATION LOADING
   * =======================================================
   */

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="admin-card">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  /*
   * =======================================================
   * ALREADY AUTHENTICATED
   * =======================================================
   *
   * All authenticated roles can return to their
   * requested shopping destination.
   */

  if (isAuthenticated && currentUser) {
    return (
      <Navigate
        to={resolveReturnPath(
          requestedLocation,
          currentUser.role
        )}
        replace
      />
    );
  }

  /*
   * =======================================================
   * LOGIN PAGE UI
   * =======================================================
   */

  return (
    <div className="login-page">
      <div className="admin-card">
        <h1>Sign In</h1>

        <p>
          Sign in to access your account.
        </p>

        {/* REGISTRATION SUCCESS */}

        {registrationSuccess && (
          <div
            className="success-message"
            role="status"
          >
            Account created successfully.
            Please sign in.
          </div>
        )}

        {/* CHECKOUT RETURN INFORMATION */}

        {isCheckoutRedirect && (
          <p className="login-redirect-message">
            Your shopping cart is ready.
            Sign in to continue to checkout.
          </p>
        )}

        {/* ORDERS RETURN INFORMATION */}

        {isOrdersRedirect && (
          <p className="login-redirect-message">
            Sign in to view your order history.
          </p>
        )}

        {/* EMAIL / PASSWORD LOGIN */}

        <form
          onSubmit={handleSubmit}
          className="checkout-form"
        >
          <div>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div
              className="error-message"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        {/* GOOGLE OAUTH2 LOGIN */}

        {GOOGLE_OAUTH_ENABLED && (
          <div className="google-login-section">
            <div className="login-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="google-login-button"
              onClick={handleGoogleLogin}
              disabled={loading || authLoading}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 5.38 6.51 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.84 7.18l7.73 6C44.34 38.03 46.98 31.87 46.98 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.45 14.45 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>

              <span>
                Continue with Google
              </span>
            </button>
          </div>
        )}

        {/* CREATE ACCOUNT */}

        <div className="auth-footer">
          <span>
            Don't have an account?
          </span>

          {" "}

          <Link
            to="/register"
            state={{
              from: requestedLocation,
            }}
          >
            Create Account
          </Link>
        </div>

        {/* CONTINUE SHOPPING AS GUEST */}

        <div className="guest-shopping-section">
          <p>
            Just browsing? You don't need an account
            to explore products.
          </p>

          <Link
            to="/shop"
            className="guest-shopping-button"
          >
            Continue Shopping as Guest
          </Link>

          <p>
            Sign in or create an account
            when you're ready to checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
