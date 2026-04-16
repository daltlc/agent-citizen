import { parsePrUrl } from "./parse-pr-url";
import { githubFetch } from "./client";

/**
 * Submits an "approved" review on a GitHub pull request.
 * Fails silently if token is not configured or API call fails.
 */
export async function approvePr(
  prUrl: string,
  body?: string
): Promise<boolean> {
  const pr = parsePrUrl(prUrl);
  if (!pr) return false;

  try {
    const response = await githubFetch(
      `/repos/${pr.owner}/${pr.repo}/pulls/${pr.number}/reviews`,
      {
        method: "POST",
        body: JSON.stringify({
          event: "APPROVE",
          body: body ?? "Approved on Agent Citizen.",
        }),
      }
    );

    return response?.ok ?? false;
  } catch {
    return false;
  }
}

/**
 * Closes a GitHub pull request.
 * Fails silently if token is not configured or API call fails.
 */
export async function closePr(prUrl: string): Promise<boolean> {
  const pr = parsePrUrl(prUrl);
  if (!pr) return false;

  try {
    const response = await githubFetch(
      `/repos/${pr.owner}/${pr.repo}/pulls/${pr.number}`,
      {
        method: "PATCH",
        body: JSON.stringify({ state: "closed" }),
      }
    );

    return response?.ok ?? false;
  } catch {
    return false;
  }
}

/**
 * Syncs PR status on GitHub when a contribution is reviewed on Citizen.
 * On accept: submits an "approved" review.
 * On reject: closes the PR.
 * Fire-and-forget -- callers should not await this.
 */
export async function syncPrStatusOnReview(
  prUrl: string,
  decision: "accepted" | "rejected"
): Promise<void> {
  if (decision === "accepted") {
    await approvePr(prUrl);
  } else {
    await closePr(prUrl);
  }
}
