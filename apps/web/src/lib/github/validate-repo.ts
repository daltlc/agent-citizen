/**
 * Parses a GitHub repository URL into its components.
 * Returns null if the URL is not a valid GitHub repo URL.
 */
export function parseRepoUrl(
  url: string
): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;

    const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/?$/);
    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2],
    };
  } catch {
    return null;
  }
}

/**
 * Checks whether a GitHub repository exists by hitting the GitHub API.
 * Uses GITHUB_TOKEN when available (5,000 req/hr), falls back to
 * unauthenticated (60 req/hr). Returns true on network errors (soft pass)
 * so transient outages don't block submissions.
 */
export async function verifyRepoExists(
  owner: string,
  repo: string
): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers, signal: AbortSignal.timeout(5000) }
    );

    if (response.status === 200) return true;
    if (response.status === 404) return false;

    // Any other status (rate-limited, server error): soft pass
    return true;
  } catch {
    // Network error or timeout: soft pass
    return true;
  }
}
