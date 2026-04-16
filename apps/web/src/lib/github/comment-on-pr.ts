import { parsePrUrl } from "./parse-pr-url";
import { githubFetch } from "./client";

/**
 * Posts a comment on a GitHub pull request.
 * Uses a server-side GITHUB_TOKEN (bot/PAT). No user token needed.
 * Fails silently if token is not configured or API call fails.
 */
export async function commentOnPr(
  prUrl: string,
  body: string
): Promise<boolean> {
  const pr = parsePrUrl(prUrl);
  if (!pr) return false;

  try {
    const response = await githubFetch(
      `/repos/${pr.owner}/${pr.repo}/issues/${pr.number}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ body }),
      }
    );

    return response?.ok ?? false;
  } catch {
    return false;
  }
}
