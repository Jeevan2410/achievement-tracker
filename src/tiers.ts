export interface Achievement {
  name: string;
  /** Thresholds for tier 1, 2, 3, ... (community-documented, may change). */
  tiers: number[];
  unit: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  pullShark: { name: "Pull Shark", tiers: [2, 16, 128, 1024], unit: "merged PRs" },
  starstruck: { name: "Starstruck", tiers: [16, 128, 512, 4096], unit: "stars on one repo" },
};

export interface Progress {
  name: string;
  count: number;
  unit: string;
  /** Highest tier reached (0 = none). */
  tier: number;
  /** Next threshold, or null when the top tier is reached. */
  next: number | null;
  remaining: number | null;
}

export function computeProgress(a: Achievement, count: number): Progress {
  const tier = a.tiers.filter((t) => count >= t).length;
  const next = tier < a.tiers.length ? a.tiers[tier] : null;
  return {
    name: a.name,
    count,
    unit: a.unit,
    tier,
    next,
    remaining: next === null ? null : next - count,
  };
}

export function formatProgress(p: Progress): string {
  const head = `${p.name}: ${p.count} ${p.unit} (tier ${p.tier})`;
  return p.next === null
    ? `${head} - top tier reached`
    : `${head} - ${p.remaining} more to reach ${p.next}`;
}
