#!/usr/bin/env node
import { ACHIEVEMENTS, computeProgress, formatProgress } from "./tiers.js";
import { maxOwnedRepoStars, mergedPullRequests } from "./github.js";

async function main(): Promise<void> {
  const user = process.argv[2];
  if (!user || user.startsWith("-")) {
    console.error("Usage: achievement-tracker <github-username>");
    console.error("Optional: set GITHUB_TOKEN for a higher API rate limit (read-only use).");
    process.exit(1);
  }
  const token = process.env.GITHUB_TOKEN;
  const [prs, stars] = await Promise.all([
    mergedPullRequests(user, token),
    maxOwnedRepoStars(user, token),
  ]);
  console.log(formatProgress(computeProgress(ACHIEVEMENTS.pullShark, prs)));
  console.log(formatProgress(computeProgress(ACHIEVEMENTS.starstruck, stars)));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
