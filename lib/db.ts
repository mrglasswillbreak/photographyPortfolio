import { neon } from '@neondatabase/serverless';

type SqlPrimitive = string | number | boolean | null | undefined;
type SqlResult<T extends Record<string, unknown>> = { rows: T[] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NeonSql = (strings: TemplateStringsArray, ...values: any[]) => Promise<Record<string, unknown>[]>;

let _neonSql: NeonSql | null = null;

function getNeonSql(): NeonSql {
  if (!_neonSql) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error(
        'Database connection string not found. Set DATABASE_URL or POSTGRES_URL environment variable.',
      );
    }
    _neonSql = neon(connectionString) as unknown as NeonSql;
  }
  return _neonSql;
}

export async function sql<T extends Record<string, unknown> = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: SqlPrimitive[]
): Promise<SqlResult<T>> {
  const neonSql = getNeonSql();
  const normalizedValues = values.map((v) => (v === undefined ? null : v));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (await neonSql(strings, ...(normalizedValues as any[]))) as T[];
  return { rows };
}

export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL DEFAULT '',
      alt VARCHAR(255) NOT NULL DEFAULT '',
      category VARCHAR(100) NOT NULL DEFAULT 'Other',
      url TEXT NOT NULL,
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id SERIAL PRIMARY KEY,
      section VARCHAR(100) NOT NULL,
      key VARCHAR(100) NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(section, key)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      icon VARCHAR(50) NOT NULL DEFAULT 'Camera',
      display_order INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(64) NOT NULL,
      page_url VARCHAR(255) NOT NULL DEFAULT '/',
      referrer_source VARCHAR(100) NOT NULL DEFAULT 'Direct',
      device_type VARCHAR(20) NOT NULL DEFAULT 'Desktop',
      browser VARCHAR(50) NOT NULL DEFAULT 'Other',
      os VARCHAR(50) NOT NULL DEFAULT 'Other',
      country VARCHAR(10) NOT NULL DEFAULT '',
      duration_seconds INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function getContent(section: string, key: string, defaultValue = ''): Promise<string> {
  const result = await sql<{ value: string }>`
    SELECT value FROM site_content WHERE section = ${section} AND key = ${key} LIMIT 1
  `;
  return result.rows[0]?.value ?? defaultValue;
}

export async function upsertContent(section: string, key: string, value: string) {
  await sql`
    INSERT INTO site_content (section, key, value, updated_at)
    VALUES (${section}, ${key}, ${value}, NOW())
    ON CONFLICT (section, key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = NOW()
  `;
}

export async function getAllContent(): Promise<Record<string, string>> {
  const result = await sql<{ section: string; key: string; value: string }>`SELECT section, key, value FROM site_content`;
  const map: Record<string, string> = {};
  for (const row of result.rows) {
    map[`${row.section}_${row.key}`] = row.value;
  }
  return map;
}

export async function getGalleryImages() {
  const result = await sql`
    SELECT * FROM gallery_images ORDER BY display_order ASC, created_at ASC
  `;
  return result.rows;
}

export async function getServices() {
  const result = await sql`
    SELECT * FROM services ORDER BY display_order ASC
  `;
  return result.rows;
}
