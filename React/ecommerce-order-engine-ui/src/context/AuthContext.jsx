
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  login as loginRequest,
  getCurrentUser,
  exchangeGoogleLoginCode,
} from "../services/authApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "accessToken";

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY)
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Invalidate previously started authentication
   * requests whenever the session changes.
   */
  const sessionVersionRef = useRef(0);

  /*
   * =========================================================
   * RESTORE AUTHENTICATION
   * =========================================================
   *
   * Validate an existing JWT through /api/auth/me.
   *
   * Ignore stale responses after logout or session changes.
   */
  useEffect(() => {
    let cancelled = false;

    const sessionVersion = ++sessionVersionRef.current;

    async function restoreAuthentication() {
      if (!accessToken) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const user = await getCurrentUser(accessToken);

        if (
          cancelled ||
          sessionVersion !== sessionVersionRef.current
        ) {
          return;
        }

        setCurrentUser(user);
      } catch {
        if (
          cancelled ||
          sessionVersion !== sessionVersionRef.current
        ) {
          return;
        }

        sessionStorage.removeItem(TOKEN_KEY);
        setAccessToken(null);
        setCurrentUser(null);
      } finally {
        if (
          !cancelled &&
          sessionVersion === sessionVersionRef.current
        ) {
          setLoading(false);
        }
      }
    }

    restoreAuthentication();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  /*
   * =========================================================
   * ESTABLISH AUTHENTICATED SESSION
   * =========================================================
   *
   * Both LOCAL and Google login use this method.
   */
  function establishSession(response) {
    const token = response?.accessToken;

    if (!token) {
      throw new Error(
        "Authentication response did not contain an access token"
      );
    }

    /*
     * Invalidate any previous authentication request.
     */
    sessionVersionRef.current += 1;

    sessionStorage.setItem(TOKEN_KEY, token);

    setAccessToken(token);

    setCurrentUser({
      userId: response.userId,
      email: response.email,
      role: response.role,
      issuedAt: response.issuedAt,
      expiresAt: response.expiresAt,
    });

    setLoading(false);

    return response;
  }

  /*
   * =========================================================
   * LOCAL LOGIN
   * =========================================================
   *
   * Login.jsx generates the reCAPTCHA token immediately
   * before calling this method.
   */
  async function login(email, password, recaptchaToken) {
    if (
      !recaptchaToken ||
      !recaptchaToken.trim()
    ) {
      throw new Error(
        "reCAPTCHA token is required"
      );
    }

    const response = await loginRequest(
      email,
      password,
      recaptchaToken
    );

    return establishSession(response);
  }

  /*
   * =========================================================
   * GOOGLE OAUTH2 LOGIN
   * =========================================================
   *
   * Exchange the one-time authorization code for
   * the application's JWT.
   */
  async function completeGoogleLogin(code) {
    if (!code || !code.trim()) {
      throw new Error(
        "Google authentication code is required"
      );
    }

    const response = await exchangeGoogleLoginCode(code);

    return establishSession(response);
  }

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   *
   * Clear the JWT and authenticated frontend state.
   *
   * Applies to LOCAL and Google users.
   */
  function logout() {
    sessionVersionRef.current += 1;

    sessionStorage.removeItem(TOKEN_KEY);

    setAccessToken(null);
    setCurrentUser(null);
    setLoading(false);
  }

  const isAuthenticated = Boolean(
    accessToken && currentUser
  );

  function hasRole(role) {
    return currentUser?.role === role;
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        currentUser,
        isAuthenticated,
        loading,
        login,
        completeGoogleLogin,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
