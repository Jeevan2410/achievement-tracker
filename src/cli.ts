#!/usr/bin/env node
import { parseArgs } from "./args.js";
import { ACHIEVEMENTS, computeProgress, formatProgress } from "./tiers.js";
import { maxOwnedRepoStars, mergedPullRequests } from "./github.js";

async function main(): Promise<void> {
  const { user, json } = parseArgs(process.argv.slice(2));
  if (!user) {
    console.error("Usage: achievement-tracker <github-username> [--json]");
    console.error("Optional: set GITHUB_TOKEN for a higher API rate limit (read-only use).");
    process.exit(1);
  }
  const token = process.env.GITHUB_TOKEN;
  const [prs, stars] = await Promise.all([
    mergedPullRequests(user, token),
    maxOwnedRepoStars(user, token),
  ]);
  const results = [
    computeProgress(ACHIEVEMENTS.pullShark, prs),
    computeProgress(ACHIEVEMENTS.starstruck, stars),
  ];
  if (json) {
    console.log(JSON.stringify({ user, achievements: results }, null, 2));
  } else {
    for (const p of results) console.log(formatProgress(p));
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
