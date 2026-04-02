import 'server-only';
import { createRequire } from 'module';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);

let _db = null;

export function getDb() {
  if (_db) return _db;

  // Ensure the prisma directory exists
  const dbDir = join(process.cwd(), 'prisma');
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = join(dbDir, 'dev.db');

  // Load the native module
  const Database = require('better-sqlite3');
  _db = new Database(dbPath);

  // Create tables if they don't exist yet
  _db.exec(`
    CREATE TABLE IF NOT EXISTS Submission (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'UNREAD',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Registry (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    -- Seed default access key if not exists
    INSERT OR IGNORE INTO Registry (key, value) VALUES ('DASHBOARD_SECRET', 'Sdet@2026');
  `);

  return _db;
}
