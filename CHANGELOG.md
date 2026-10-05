# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-10-05

### Added
- CLI that reports progress toward Pull Shark and Starstruck tiers from public GitHub data.
- `--json` flag for machine-readable output.
- Text progress bar toward the next tier.
- `--help` / `-h` and `--version` / `-v` flags.
- Optional `GITHUB_TOKEN` environment variable to raise the API rate limit.

### Fixed
- Repo list is paginated, so stars beyond the first 100 repos are counted.
- Friendly messages for rate limits (403/429) and unknown users (404).
