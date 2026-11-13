export type Migration = { name: string; sql: string };
export type MigrationClient = { query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> };

export function readMigrations(): Promise<Migration[]>;
export function applyMigrations(
  client: MigrationClient,
  migrations: Migration[],
  log?: (message: string) => void,
): Promise<string[]>;
export function pooledDatabaseUrl(env?: Record<string, string | undefined>): string;
export function directDatabaseUrl(env?: Record<string, string | undefined>): string;
