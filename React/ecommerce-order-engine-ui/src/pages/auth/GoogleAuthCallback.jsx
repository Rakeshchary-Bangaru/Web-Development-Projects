
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

const GOOGLE_RETURN_PATH_KEY =
  "googleOAuthReturnPath";

/*
 * =========================================================
 * SHOPPING ROLES
 * =========================================================
 *
 * All four authenticated roles can shop:
 *
 * CUSTOMER
 * SELLER_ADMIN
 * IT_SUPPORT
 * ROOT
 *
 * Administrative roles grant additional permissions
 * without removing normal shopping privileges.
 */

const SHOPPING_ROLES = new Set([
  "CUSTOMER",
  "SELLER_ADMIN",
  "IT_SUPPORT",
  "ROOT",
]);

/*
 * =========================================================
 * ALLOWED RETURN DESTINATIONS
 * =========================================================
 *
 * Prevent arbitrary redirects after Google OAuth2.
 *
 * Only these shopping destinations can be restored
 * from sessionStorage.
 */

const ALLOWED_RETURN_PATHS = new Set([
  "/shop/checkout",
  "/shop/orders",
]);

/*
 * =========================================================
 * DEFAULT DESTINATION
 * =========================================================
 *
 * After Google sign-in, all users go to /shop
 * unless they were returning to an allowed route.
 */

function destinationForRole() {
  return "/shop";
}

/*
 * =========================================================
 * RESOLVE AUTHENTICATED RETURN PATH
 * =========================================================
 *
 * CUSTOMER, ROOT, SELLER_ADMIN and IT_SUPPORT can
 * all resume checkout or view their own orders.
 *
 * We never redirect to arbitrary external URLs.
 */

function resolveDestination(role, savedPath) {
  if (
    SHOPPING_ROLES.has(role) &&
    ALLOWED_RETURN_PATHS.has(savedPath)
  ) {
    return savedPath;
  }

  return destinationForRole();
}

/*
 * =========================================================
 * GOOGLE AUTH CALLBACK
 * =========================================================
 */

export default function GoogleAuthCallback() {
  const navigate = useNavigate();

  const { completeGoogleLogin } = useAuth();

  const [error, setError] = useState("");

  /*
   * Prevent duplicate one-time code exchanges
   * under React StrictMode.
   */

  const exchangeStarted = useRef(false);

  useEffect(() => {
    if (exchangeStarted.current) {
      return;
    }

    exchangeStarted.current = true;

    /*
     * =====================================================
     * READ TEMPORARY LOGIN CODE
     * =====================================================
     *
     * This is not the application JWT.
     *
     * Spring Boot generates a short-lived one-time
     * code after successful Google authentication.
     */

    const params = new URLSearchParams(
      window.location.search
    );

    const code = params.get("code");

    /*
     * =====================================================
     * REMOVE CODE FROM BROWSER ADDRESS BAR
     * =====================================================
     *
     * Avoid leaving the temporary login code in
     * browser history or subsequent navigation URLs.
     */

    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    );

    if (!code) {
      sessionStorage.removeItem(
        GOOGLE_RETURN_PATH_KEY
      );

      setError(
        "Google authentication code is missing"
      );

      return;
    }

    /*
     * =====================================================
     * COMPLETE GOOGLE LOGIN
     * =====================================================
     */

    async function finishLogin() {
      try {
        /*
         * Exchange the one-time login code
         * for the application's JWT.
         *
         * AuthContext handles JWT storage and
         * the authenticated user state.
         */

        const response =
          await completeGoogleLogin(code);

        const role = response.role;

        /*
         * Restore the route saved by Login.jsx
         * before redirecting to Google.
         */

        const savedPath =
          sessionStorage.getItem(
            GOOGLE_RETURN_PATH_KEY
          );

        /*
         * Clear the saved path after successful
         * authentication so it cannot affect
         * future logins.
         */

        sessionStorage.removeItem(
          GOOGLE_RETURN_PATH_KEY
        );

        /*
         * Every authenticated role can return
         * to checkout or own-order history.
         */

        const destination =
          resolveDestination(
            role,
            savedPath
          );

        navigate(destination, {
          replace: true,
        });
      } catch {
        sessionStorage.removeItem(
          GOOGLE_RETURN_PATH_KEY
        );

        setError(
          "Unable to complete Google authentication"
        );
      }
    }

    finishLogin();
  }, [completeGoogleLogin, navigate]);

  /*
   * =========================================================
   * ERROR STATE
   * =========================================================
   */

  if (error) {
    return (
      <main>
        <h2>Google sign-in failed</h2>

        <p>{error}</p>

        <button
          type="button"
          onClick={() =>
            navigate("/login", {
              replace: true,
            })
          }
        >
          Return to login
        </button>
      </main>
    );
  }

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

  return (
    <main>
      <h2>Completing Google sign-in...</h2>

      <p>Validating your account.</p>
    </main>
  );
}
