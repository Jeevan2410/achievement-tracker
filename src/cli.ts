#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { helpText, parseArgs } from "./args.js";
import { ACHIEVEMENTS, computeProgress, formatProgress } from "./tiers.js";
import { acceptedAnswers, maxOwnedRepoStars, mergedPullRequests } from "./github.js";

async function main(): Promise<void> {
  const { user, json, help, version } = parseArgs(process.argv.slice(2));
  if (help) {
    console.log(helpText());
    return;
  }
  if (version) {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    console.log(pkg.version);
    return;
  }
  if (!user) {
    console.error(helpText());
    process.exit(1);
  }
  const token = process.env.GITHUB_TOKEN;
  const [prs, stars, answers] = await Promise.all([
    mergedPullRequests(user, token),
    maxOwnedRepoStars(user, token),
    token ? acceptedAnswers(user, token) : Promise.resolve(undefined),
  ]);
  const results = [
    computeProgress(ACHIEVEMENTS.pullShark, prs),
    computeProgress(ACHIEVEMENTS.starstruck, stars),
  ];
  if (answers !== undefined) results.push(computeProgress(ACHIEVEMENTS.galaxyBrain, answers));
  if (json) {
    console.log(JSON.stringify({ user, achievements: results }, null, 2));
  } else {
    for (const p of results) console.log(formatProgress(p));
    if (answers === undefined) {
      console.log("Galaxy Brain: set GITHUB_TOKEN to include it (GitHub's GraphQL API needs a token).");
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
