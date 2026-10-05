export interface Args {
  user?: string;
  json: boolean;
}

export function parseArgs(argv: string[]): Args {
  const args: Args = { json: false };
  for (const a of argv) {
    if (a === "--json") args.json = true;
    else if (!a.startsWith("-") && !args.user) args.user = a;
  }
  return args;
}
