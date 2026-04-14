import { parsePrUrl } from "./parse-pr-url";

/**
 * Posts a comment on a GitHub pull request.
 * Uses a server-side GITHUB_TOKEN (bot/PAT). No user token needed.
 * Fails silently if token is not configured or API call fails.
 */
export async function commentOnPr(
  prUrl: string,
  body: string
): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return false;

  const pr = parsePrUrl(prUrl);
  if (!pr) return false;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${pr.owner}/${pr.repo}/issues/${pr.number}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}
