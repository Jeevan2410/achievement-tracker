export function apiErrorMessage(status: number, path: string, hasToken: boolean): string {
  if (status === 403 || status === 429) {
    return hasToken
      ? `GitHub API rate limit reached (HTTP ${status}). Wait a few minutes and try again.`
      : `GitHub API rate limit reached (HTTP ${status}). Set GITHUB_TOKEN to raise the limit.`;
  }
  if (status === 404) {
    return `Not found (HTTP 404) for ${path}. Check the username.`;
  }
  return `GitHub API error (HTTP ${status}) for ${path}.`;
}
