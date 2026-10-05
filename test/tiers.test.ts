import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, computeProgress, formatProgress } from "../src/tiers.js";

describe("computeProgress", () => {
  it("reports no tier below the first threshold", () => {
    const p = computeProgress(ACHIEVEMENTS.pullShark, 1);
    expect(p.tier).toBe(0);
    expect(p.next).toBe(2);
    expect(p.remaining).toBe(1);
  });

  it("computes remaining to the next tier", () => {
    const p = computeProgress(ACHIEVEMENTS.pullShark, 45);
    expect(p.tier).toBe(2);
    expect(p.next).toBe(128);
    expect(p.remaining).toBe(83);
  });

  it("treats a count equal to a threshold as reaching it", () => {
    expect(computeProgress(ACHIEVEMENTS.starstruck, 16).tier).toBe(1);
  });

  it("returns null next at the top tier", () => {
    const p = computeProgress(ACHIEVEMENTS.pullShark, 5000);
    expect(p.next).toBeNull();
    expect(formatProgress(p)).toContain("top tier reached");
  });
});
