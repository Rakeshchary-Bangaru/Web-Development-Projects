const BASE_URL = "/api/auth";


/*
 * =========================================================
 * REGISTER
 * ---------------------------------------------------------
 * Creates a new CUSTOMER account.
 *
 * Registration is still unchanged for now.
 * reCAPTCHA will be added to registration later.
 * =========================================================
 */
export async function register(
  name,
  email,
  password,
  recaptchaToken
) {

  const response = await fetch(
    `${BASE_URL}/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
        recaptchaToken,
      }),
    }
  );


  if (!response.ok) {

    let message =
      "Registration failed";

    try {

      const body =
        await response.text();

      if (body) {
        message = body;
      }

    } catch {
      // Keep default message.
    }


    throw new Error(message);
  }


  return response.json();
}


/*
 * =========================================================
 * LOGIN
 * ---------------------------------------------------------
 * Login now requires a fresh reCAPTCHA Enterprise token.
 *
 * Login.jsx generates the token immediately before calling
 * AuthContext.login().
 *
 * AuthContext forwards it here.
 *
 * This function sends it to Spring Boot together with the
 * user's email and password.
 * =========================================================
 */
export async function login(
  email,
  password,
  recaptchaToken
) {

  const response = await fetch(
    `${BASE_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
        recaptchaToken,
      }),
    }
  );


  if (!response.ok) {

    let message =
      "Login failed";

    try {

      const body =
        await response.text();

      if (body) {
        message = body;
      }

    } catch {
      // Keep default message.
    }


    throw new Error(message);
  }


  return response.json();
}


/*
 * =========================================================
 * CURRENT AUTHENTICATED USER
 * ---------------------------------------------------------
 * Requires the JWT access token returned by login.
 * =========================================================
 */
export async function getCurrentUser(
  accessToken
) {

  const response = await fetch(
    `${BASE_URL}/me`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${accessToken}`,
      },
    }
  );


  if (!response.ok) {

    throw new Error(
      "Unable to load current user"
    );
  }


  return response.json();
}

/*
 * =========================================================
 * GOOGLE OAUTH2 LOGIN CODE EXCHANGE
 * ---------------------------------------------------------
 * After successful Google authentication:
 *
 * 1. Spring Boot creates a short-lived, one-time code.
 * 2. React receives the code through the callback URL.
 * 3. React exchanges the code for the application's JWT.
 *
 * The JWT must never be placed in the redirect URL.
 *
 * The backend endpoint must be implemented before use.
 * =========================================================
 */
export async function exchangeGoogleLoginCode(code) {

  if (!code || typeof code !== "string") {
    throw new Error(
      "Google authentication code is required"
    );
  }

  const response = await fetch(
    `${BASE_URL}/oauth2/exchange`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "same-origin",

      cache: "no-store",

      body: JSON.stringify({
        code,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to complete Google authentication"
    );
  }

  return response.json();
}