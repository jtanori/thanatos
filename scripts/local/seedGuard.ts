const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);

export function assertLocalSeedAllowed(env: NodeJS.ProcessEnv = process.env): void {
  if (env.NODE_ENV === "production") {
    throw new Error("Local seed refused: NODE_ENV=production");
  }
  if (env.ALLOW_LOCAL_SEED !== "1") {
    throw new Error("Local seed refused: set ALLOW_LOCAL_SEED=1");
  }
  if (!env.LOCAL_SEED_PASSWORD) {
    throw new Error("Local seed refused: set LOCAL_SEED_PASSWORD");
  }
  if (!env.DATABASE_URL) {
    throw new Error("Local seed refused: DATABASE_URL is required");
  }

  let host: string;
  try {
    host = new URL(env.DATABASE_URL).hostname;
  } catch {
    throw new Error("Local seed refused: invalid DATABASE_URL");
  }

  if (!LOCAL_HOSTS.has(host)) {
    throw new Error(`Local seed refused: DATABASE_URL host "${host}" is not local`);
  }
}
