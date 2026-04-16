import { parseRepoUrl } from "./validate-repo";
import { githubFetch } from "./client";

/**
 * Fetches the date of the latest commit on the default branch for a GitHub repo.
 * Returns null on any failure (rate limit, network, invalid URL).
 */
export async function getLatestCommitDate(
  repoUrl: string
): Promise<Date | null> {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) return null;

  try {
    const response = await githubFetch(
      `/repos/${parsed.owner}/${parsed.repo}/commits?per_page=1`,
      {
        requireToken: false,
        timeoutMs: 5000,
        next: { revalidate: 3600 },
      }
    );

    if (!response?.ok) return null;

    const commits = await response.json();
    if (!Array.isArray(commits) || commits.length === 0) return null;

    const dateStr = commits[0]?.commit?.committer?.date;
    if (!dateStr) return null;

    return new Date(dateStr);
  } catch {
    return null;
  }
}

/**
 * Batch-fetches latest commit dates for multiple repo URLs.
 * Returns a map from repoUrl to date string (or null).
 */
export async function getLatestCommitDates(
  repoUrls: (string | null | undefined)[]
): Promise<Map<string, string>> {
  const uniqueUrls = Array.from(new Set(repoUrls.filter(Boolean))) as string[];
  const results = new Map<string, string>();

  const promises = uniqueUrls.map(async (url) => {
    const date = await getLatestCommitDate(url);
    if (date) {
      results.set(url, formatRelativeDate(date));
    }
  });

  await Promise.all(promises);
  return results;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
