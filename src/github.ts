const API = "https://api.github.com";

function headers(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "achievement-tracker",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function get<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers(token) });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${path}: ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function mergedPullRequests(user: string, token?: string): Promise<number> {
  const q = encodeURIComponent(`type:pr author:${user} is:merged`);
  const data = await get<{ total_count: number }>(`/search/issues?q=${q}&per_page=1`, token);
  return data.total_count;
}

export async function maxOwnedRepoStars(user: string, token?: string): Promise<number> {
  const repos = await get<{ stargazers_count: number; fork: boolean }[]>(
    `/users/${encodeURIComponent(user)}/repos?per_page=100&type=owner`,
    token,
  );
  return repos.filter((r) => !r.fork).reduce((m, r) => Math.max(m, r.stargazers_count), 0);
}
