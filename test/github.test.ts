import { afterEach, describe, expect, it, vi } from "vitest";
import { maxOwnedRepoStars } from "../src/github.js";

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
