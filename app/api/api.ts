export async function authFetch(url: string, options: RequestInit = {}) {
  // If running on the server (SSR) just forward the call — no localStorage/cookies available here
  if (typeof window === "undefined") {
    return fetch(url, options);
  }

  // Support both possible localStorage keys used in the project
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    undefined;

  // Merge headers safely and preserve any headers provided by the caller
  const headers = new Headers((options.headers as HeadersInit) || {});

  // Add Authorization header only if we have a token
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // If there's a body and no Content-Type provided, assume JSON (unless FormData)
  const body = (options as any).body;
  const hasContentType = Array.from(headers.keys()).some(
    (k) => k.toLowerCase() === "content-type"
  );

  if (!hasContentType && body != null && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Ensure browser-side requests include credentials (cookies) by default so
  // backends that set HttpOnly cookies are compatible. Honor caller-provided credentials.
  const finalOptions: RequestInit = {
    ...options,
    headers,
    credentials: (options.credentials as RequestCredentials) ?? "include",
  };

  return fetch(url, finalOptions);
}
