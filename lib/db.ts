import { sql } from '@vercel/postgres';

export { sql };

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
}

export async function getContent(section: string, key: string, defaultValue = ''): Promise<string> {
  const result = await sql`
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
  const result = await sql`SELECT section, key, value FROM site_content`;
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
