export interface Args {
  user?: string;
  json: boolean;
  help: boolean;
  version: boolean;
}

export function parseArgs(argv: string[]): Args {
  const args: Args = { json: false, help: false, version: false };
  for (const a of argv) {
    if (a === "--json") args.json = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--version" || a === "-v") args.version = true;
    else if (!a.startsWith("-") && !args.user) args.user = a;
  }
  return args;
}

export function helpText(): string {
  return [
    "Usage: achievement-tracker <github-username> [options]",
    "",
    "Shows progress toward GitHub profile achievement tiers using public data.",
    "",
    "Options:",
    "  --json         print machine-readable JSON",
    "  -h, --help     show this help",
    "  -v, --version  show the version",
    "",
    "Environment:",
    "  GITHUB_TOKEN   optional, raises the API rate limit (read-only use)",
  ].join("\n");
}
