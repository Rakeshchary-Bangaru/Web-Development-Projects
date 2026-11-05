const TOKEN_KEY = "accessToken";


export function getAccessToken() {

  return sessionStorage.getItem(
    TOKEN_KEY
  );
}


export async function authenticatedFetch(
  url,
  options = {}
) {

  const token =
    getAccessToken();


  if (!token) {

    throw new Error(
      "Authentication is required"
    );
  }


  const headers =
    new Headers(
      options.headers || {}
    );


  headers.set(
    "Authorization",
    `Bearer ${token}`
  );


  const response =
    await fetch(
      url,
      {
        ...options,
        headers,
      }
    );


  if (response.status === 401) {

    sessionStorage.removeItem(
      TOKEN_KEY
    );

    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }


  if (response.status === 403) {

    throw new Error(
      "You are not authorized to perform this action."
    );
  }


  return response;
}