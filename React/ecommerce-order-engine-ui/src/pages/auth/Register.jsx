
import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { register } from "../../services/authApi";

import "../../styles/components/Auth.css";

/*
 * =========================================================
 * GOOGLE RECAPTCHA ENTERPRISE
 * =========================================================
 */

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/*
 * =========================================================
 * SAFE CHECKOUT RETURN PATH
 * =========================================================
 *
 * Preserve only intended CUSTOMER routes.
 * Do not redirect to arbitrary external URLs.
 */

function getSafeReturnPath(from) {
  const pathname =
    typeof from === "string"
      ? from.split(/[?#]/, 1)[0]
      : from?.pathname;

  if (
    pathname === "/shop/checkout" ||
    pathname === "/shop/orders"
  ) {
    return pathname;
  }

  return null;
}

/*
 * =========================================================
 * REGISTER COMPONENT
 * =========================================================
 */

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * =======================================================
   * PREVIOUSLY REQUESTED DESTINATION
   * =======================================================
   *
   * Example:
   *
   * Guest -> Cart -> Register -> Login -> Checkout
   */

  const returnPath = getSafeReturnPath(
    location.state?.from
  );

  const isCheckoutRegistration =
    returnPath === "/shop/checkout";

  /*
   * =======================================================
   * GENERATE RECAPTCHA ENTERPRISE TOKEN
   * =======================================================
   *
   * A fresh token is generated immediately before
   * registration.
   *
   * Backend expected action: register
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
                  action: "register",
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
   * REGISTRATION SUBMISSION
   * =======================================================
   */

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    /*
     * Basic frontend validation.
     *
     * Backend validation remains authoritative.
     */

    const cleanedName = name.trim();
    const cleanedEmail = email.trim();

    if (!cleanedName) {
      setError("Please enter your name");
      return;
    }

    if (!cleanedEmail) {
      setError("Please enter your email");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      /*
       * Generate fresh reCAPTCHA token.
       */

      const recaptchaToken =
        await generateRecaptchaToken();

      /*
       * Register CUSTOMER account through
       * Spring Boot.
       *
       * The backend handles password hashing,
       * account creation and reCAPTCHA validation.
       */

      await register(
        cleanedName,
        cleanedEmail,
        password,
        recaptchaToken
      );

      /*
       * =================================================
       * REGISTRATION SUCCESS
       * =================================================
       *
       * Registration does not automatically log
       * the customer in.
       *
       * Preserve the checkout destination so that
       * Login.jsx can redirect the customer after
       * successful authentication.
       */

      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess: true,
          from: returnPath
            ? { pathname: returnPath }
            : null,
        },
      });
    } catch (err) {
      setError(
        err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * REGISTRATION UI
   * =========================================================
   */

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* PAGE HEADER */}

        <div className="auth-header">
          <h1>Create Account</h1>

          <p>
            Create your customer account
            to start shopping.
          </p>

          {isCheckoutRegistration && (
            <p
              className="login-redirect-message"
              role="status"
            >
              Your shopping cart is ready.
              Create an account to continue
              to checkout.
            </p>
          )}
        </div>

        {/* REGISTRATION FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="form-group">
            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              autoComplete="name"
              disabled={loading}
              required
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
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

          {/* PASSWORD */}

          <div className="form-group">
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
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              minLength={8}
              disabled={loading}
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={8}
              disabled={loading}
              required
            />
          </div>

          {/* ERROR MESSAGE */}

          {error && (
            <div
              className="error-message"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            className="primary-button auth-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* EXISTING ACCOUNT */}

        <div className="auth-footer">
          <span>
            Already have an account?
          </span>

          {" "}

          <Link
            to="/login"
            state={{
              from: returnPath
                ? { pathname: returnPath }
                : null,
            }}
          >
            Sign In
          </Link>
        </div>

        {/* CONTINUE SHOPPING AS GUEST */}

        <div
          className="guest-shopping-section"
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            Just browsing? Explore our store
            without creating an account.
          </p>

          <Link
            to="/shop"
            className="guest-shopping-button"
            style={{
              display: "block",
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#374151",
              textDecoration: "none",
              fontWeight: "600",
              backgroundColor: "#ffffff",
            }}
          >
            Continue Shopping as Guest
          </Link>

          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "10px",
            }}
          >
            A CUSTOMER account is required
            to complete checkout.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;
