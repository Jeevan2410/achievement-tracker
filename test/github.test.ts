import { afterEach, describe, expect, it, vi } from "vitest";
import { acceptedAnswers, maxOwnedRepoStars } from "../src/github.js";

function repos(n: number, stars: (i: number) => number, fork = false) {
  return Array.from({ length: n }, (_, i) => ({ stargazers_count: stars(i), fork }));
}

function mockPages(pages: unknown[][]) {
  const fetchMock = vi.fn(async (url: string) => {
    const page = Number(new URL(url).searchParams.get("page"));
    return new Response(JSON.stringify(pages[page - 1] ?? []), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("maxOwnedRepoStars", () => {
  it("stops after a short first page", async () => {
    const f = mockPages([repos(3, (i) => i)]);
    expect(await maxOwnedRepoStars("u")).toBe(2);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("follows pagination and finds stars on later pages", async () => {
    const f = mockPages([repos(100, () => 1), repos(5, (i) => (i === 4 ? 40 : 0))]);
    expect(await maxOwnedRepoStars("u")).toBe(40);
    expect(f).toHaveBeenCalledTimes(2);
  });

  it("ignores forks", async () => {
    mockPages([repos(2, () => 99, true)]);
    expect(await maxOwnedRepoStars("u")).toBe(0);
  });
});

describe("acceptedAnswers", () => {
  function mockGraphql(body: unknown, status = 200) {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify(body), { status }),
    );
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("posts the login as a variable with the token and returns the count", async () => {
    const f = mockGraphql({ data: { user: { repositoryDiscussionComments: { totalCount: 3 } } } });
    expect(await acceptedAnswers("octocat", "tkn")).toBe(3);
    const [url, init] = f.mock.calls[0]!;
    expect(url).toBe("https://api.github.com/graphql");
    expect(init?.method).toBe("POST");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer tkn");
    expect(JSON.parse(String(init?.body)).variables).toEqual({ login: "octocat" });
  });

  it("reports an unknown user", async () => {
    mockGraphql({ data: { user: null } });
    await expect(acceptedAnswers("nobody", "tkn")).rejects.toThrow("Check the username");
  });

  it("surfaces GraphQL errors", async () => {
    mockGraphql({ errors: [{ message: "Bad credentials" }] });
    await expect(acceptedAnswers("u", "tkn")).rejects.toThrow("Bad credentials");
  });

  it("maps HTTP failures to the friendly API message", async () => {
    mockGraphql({}, 403);
    await expect(acceptedAnswers("u", "tkn")).rejects.toThrow("rate limit");
  });
});
