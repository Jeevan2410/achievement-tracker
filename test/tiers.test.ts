import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, computeProgress, formatProgress, progressBar } from "../src/tiers.js";

describe("progressBar", () => {
  it("renders empty, half and full bars", () => {
    expect(progressBar(0, 10, 10)).toBe("[----------] 0%");
    expect(progressBar(5, 10, 10)).toBe("[#####-----] 50%");
    expect(progressBar(10, 10, 10)).toBe("[##########] 100%");
  });

  it("clamps counts above the target", () => {
    expect(progressBar(50, 10, 10)).toBe("[##########] 100%");
  });

  it("is included in formatted progress below the top tier", () => {
    const text = formatProgress(computeProgress(ACHIEVEMENTS.pullShark, 64));
    expect(text).toContain("[##########----------] 50%");
  });
});

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

  it("treats a single-tier badge as done once reached", () => {
    expect(computeProgress(ACHIEVEMENTS.publicSponsor, 0)).toMatchObject({ tier: 0, next: 1, remaining: 1 });
    const done = computeProgress(ACHIEVEMENTS.publicSponsor, 2);
    expect(done).toMatchObject({ tier: 1, next: null });
    expect(formatProgress(done)).toContain("top tier reached");
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
