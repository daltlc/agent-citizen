/**
 * Parses a GitHub pull request URL into its components.
 * Returns null if the URL is not a valid GitHub PR URL.
 */
export function parsePrUrl(url: string): {
  owner: string;
  repo: string;
  number: number;
} | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;

    const match = parsed.pathname.match(
      /^\/([^/]+)\/([^/]+)\/pull\/(\d+)/
    );
    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3], 10),
    };
  } catch {
    return null;
  }
}
