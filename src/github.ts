import { apiErrorMessage } from "./errors.js";

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
    throw new Error(apiErrorMessage(res.status, path, Boolean(token)));
  }
  return (await res.json()) as T;
}

export async function mergedPullRequests(user: string, token?: string): Promise<number> {
  const q = encodeURIComponent(`type:pr author:${user} is:merged`);
  const data = await get<{ total_count: number }>(`/search/issues?q=${q}&per_page=1`, token);
  return data.total_count;
}

const ACCEPTED_ANSWERS_QUERY = `query($login: String!) {
  user(login: $login) { repositoryDiscussionComments(onlyAnswers: true) { totalCount } }
}`;

/** Discussions comments marked as the answer (Galaxy Brain). GraphQL requires a token. */
export async function acceptedAnswers(user: string, token: string): Promise<number> {
  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ query: ACCEPTED_ANSWERS_QUERY, variables: { login: user } }),
  });
  if (!res.ok) {
    throw new Error(apiErrorMessage(res.status, "/graphql", true));
  }
  const data = (await res.json()) as {
    data?: { user: { repositoryDiscussionComments: { totalCount: number } } | null };
    errors?: { message: string }[];
  };
  if (data.errors?.length) throw new Error(`GitHub GraphQL error: ${data.errors[0]!.message}`);
  if (!data.data?.user) throw new Error(`Not found: user ${user}. Check the username.`);
  return data.data.user.repositoryDiscussionComments.totalCount;
}

const PER_PAGE = 100;
const MAX_PAGES = 10;

export async function maxOwnedRepoStars(user: string, token?: string): Promise<number> {
  let max = 0;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const repos = await get<{ stargazers_count: number; fork: boolean }[]>(
      `/users/${encodeURIComponent(user)}/repos?per_page=${PER_PAGE}&type=owner&page=${page}`,
      token,
    );
    for (const r of repos) {
      if (!r.fork) max = Math.max(max, r.stargazers_count);
    }
    if (repos.length < PER_PAGE) break;
  }
  return max;
}
