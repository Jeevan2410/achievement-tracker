# achievement-tracker

A small CLI that shows how far you are from the next tier of GitHub profile achievements, using only public GitHub data.

## Problem
GitHub does not publish achievement criteria, and the profile badge does not tell you how many PRs or stars remain for the next tier. This tool does the arithmetic.

## Demo
```
$ achievement-tracker octocat
Pull Shark: 45 merged PRs (tier 2) - 83 more to reach 128
Starstruck: 1 stars on one repo (tier 0) - 15 more to reach 16
```

## Install
```bash
git clone https://github.com/Jeevan2410/achievement-tracker.git
cd achievement-tracker
npm install
npm run build
node dist/cli.js <github-username>
```

## Usage
```bash
node dist/cli.js <github-username>
```
Add `--json` for machine-readable output:
```bash
node dist/cli.js <github-username> --json
```
Set `GITHUB_TOKEN` to raise the API rate limit. The tool only reads public data.

Tier thresholds are community-documented, not official; see
https://github.com/Schweinepriester/github-profile-achievements and
https://redirect.github.com/orgs/community/discussions/38187. They may change.

## Roadmap
See [docs/PR_PLAN.md](docs/PR_PLAN.md). Ideas: more achievements, `--json` output, a config file, a pretty table.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md). License: MIT.
