import { parsePrUrl } from "./parse-pr-url";

/**
 * Appends a "Fixes #N" reference to a GitHub PR description if not already present.
 * Fails silently if token is not configured or API call fails.
 */
export async function ensurePrIssueRef(
  prUrl: string,
  issueNumber: number
): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return false;

  const pr = parsePrUrl(prUrl);
  if (!pr) return false;

  const ref = `#${issueNumber}`;

  try {
    // Fetch the current PR body
    const getRes = await fetch(
      `https://api.github.com/repos/${pr.owner}/${pr.repo}/pulls/${pr.number}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    if (!getRes.ok) return false;

    const prData = await getRes.json();
    const title: string = prData.title ?? "";
    const body: string = prData.body ?? "";

    // Check if the issue is already referenced anywhere in the PR
    const refPattern = new RegExp(
      `(fixes|closes|resolves|refs|references)\\s+${ref}\\b`,
      "i"
    );
    if (refPattern.test(title) || refPattern.test(body) || body.includes(ref)) {
      return true; // already referenced
    }

    // Append the reference to the PR body
    const updatedBody = body.trimEnd() + `\n\nFixes ${ref}`;
    const patchRes = await fetch(
      `https://api.github.com/repos/${pr.owner}/${pr.repo}/pulls/${pr.number}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: updatedBody }),
      }
    );

    return patchRes.ok;
  } catch {
    return false;
  }
}
