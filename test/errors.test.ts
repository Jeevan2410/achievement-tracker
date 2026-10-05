import { describe, expect, it } from "vitest";
import { apiErrorMessage } from "../src/errors.js";

describe("apiErrorMessage", () => {
  it("suggests GITHUB_TOKEN on rate limit without a token", () => {
    expect(apiErrorMessage(403, "/x", false)).toContain("GITHUB_TOKEN");
    expect(apiErrorMessage(429, "/x", false)).toContain("GITHUB_TOKEN");
  });

  it("does not suggest a token when one is already set", () => {
    expect(apiErrorMessage(403, "/x", true)).not.toContain("GITHUB_TOKEN");
  });

  it("explains 404 and other errors", () => {
    expect(apiErrorMessage(404, "/users/zz", false)).toContain("Check the username");
    expect(apiErrorMessage(500, "/x", false)).toContain("HTTP 500");
  });
});
