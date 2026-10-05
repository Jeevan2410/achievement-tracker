import { describe, expect, it } from "vitest";
import { helpText, parseArgs } from "../src/args.js";

describe("parseArgs", () => {
  it("reads the username", () => {
    expect(parseArgs(["octocat"])).toEqual({
      user: "octocat",
      json: false,
      help: false,
      version: false,
    });
  });

  it("detects --json in any position", () => {
    expect(parseArgs(["--json", "octocat"]).json).toBe(true);
    expect(parseArgs(["octocat", "--json"]).json).toBe(true);
  });

  it("returns no user when only flags are given", () => {
    expect(parseArgs(["--json"]).user).toBeUndefined();
    expect(parseArgs([]).user).toBeUndefined();
  });

  it("detects help and version flags, long and short", () => {
    expect(parseArgs(["--help"]).help).toBe(true);
    expect(parseArgs(["-h"]).help).toBe(true);
    expect(parseArgs(["--version"]).version).toBe(true);
    expect(parseArgs(["-v"]).version).toBe(true);
  });
});

describe("helpText", () => {
  it("documents every option", () => {
    const t = helpText();
    for (const flag of ["--json", "--help", "--version", "GITHUB_TOKEN"]) {
      expect(t).toContain(flag);
    }
  });
});
