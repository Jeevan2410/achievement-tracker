import { describe, expect, it } from "vitest";
import { parseArgs } from "../src/args.js";

describe("parseArgs", () => {
  it("reads the username", () => {
    expect(parseArgs(["octocat"])).toEqual({ user: "octocat", json: false });
  });

  it("detects --json in any position", () => {
    expect(parseArgs(["--json", "octocat"]).json).toBe(true);
    expect(parseArgs(["octocat", "--json"]).json).toBe(true);
  });

  it("returns no user when only flags are given", () => {
    expect(parseArgs(["--json"]).user).toBeUndefined();
    expect(parseArgs([]).user).toBeUndefined();
  });
});
