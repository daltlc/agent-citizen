const GITHUB_API_BASE = "https://api.github.com";

/**
 * Shared GitHub API fetch wrapper.
 * Attaches auth and accept headers automatically.
 * Returns the Response, or null if no token is configured (when `requireToken` is true).
 */
export async function githubFetch(
  path: string,
  options: RequestInit & { requireToken?: boolean; timeoutMs?: number } = {}
): Promise<Response | null> {
  const { requireToken = true, timeoutMs, ...fetchOptions } = options;
  const token = process.env.GITHUB_TOKEN;

  if (requireToken && !token) return null;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (fetchOptions.body) {
    headers["Content-Type"] = "application/json";
  }

  const signal = timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined;

  return fetch(`${GITHUB_API_BASE}${path}`, {
    ...fetchOptions,
    headers,
    signal: fetchOptions.signal ?? signal,
  });
}
