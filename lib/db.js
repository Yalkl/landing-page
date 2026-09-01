import { Pool } from 'pg';
import defaultContent from '../data/content.json';

let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
}

export async function getContent() {
  if (!pool) return defaultContent;
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS site_content (key VARCHAR(50) PRIMARY KEY, data JSONB, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);');
    const res = await pool.query("SELECT data FROM site_content WHERE key = 'landing_page'");
    if (res.rows.length > 0) return res.rows[0].data;
    await pool.query("INSERT INTO site_content (key, data) VALUES ('landing_page', $1)", [defaultContent]);
    return defaultContent;
  } catch (err) {
    console.error('DB read error:', err);
    return defaultContent;
  }
}

export async function saveContent(data) {
  if (!pool) return false;
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS site_content (key VARCHAR(50) PRIMARY KEY, data JSONB, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);');
    await pool.query("INSERT INTO site_content (key, data, updated_at) VALUES ('landing_page', $1, NOW()) ON CONFLICT (key) DO UPDATE SET data = $1, updated_at = NOW();", [data]);
    return true;
  } catch (err) {
    console.error('DB write error:', err);
    return false;
  }
}
