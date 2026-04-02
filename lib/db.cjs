const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

let _db = null;

function getDb() {
  if (_db) return _db;

  const dbDir = path.join(process.cwd(), 'prisma');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'dev.db');
  _db = new Database(dbPath);

  _db.exec(`
    CREATE TABLE IF NOT EXISTS Submission (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'UNREAD',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      employee_name TEXT,
      is_anonymous INTEGER DEFAULT 1,
      image_url TEXT,
      video_url TEXT,
      file_url TEXT
    );

    CREATE TABLE IF NOT EXISTS Registry (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    -- Seed default access key if not exists
    INSERT OR IGNORE INTO Registry (key, value) VALUES ('DASHBOARD_SECRET', 'Sdet@2026');
  `);

  // Extra safety: dynamic column addition for existing databases
  try {
    const columns = _db.prepare("PRAGMA table_info(Submission)").all();
    const names = columns.map(c => c.name);
    if (!names.includes('employee_name')) _db.exec("ALTER TABLE Submission ADD COLUMN employee_name TEXT;");
    if (!names.includes('is_anonymous')) _db.exec("ALTER TABLE Submission ADD COLUMN is_anonymous INTEGER DEFAULT 1;");
    if (!names.includes('employee_email')) _db.exec("ALTER TABLE Submission ADD COLUMN employee_email TEXT;");
    if (!names.includes('employee_phone')) _db.exec("ALTER TABLE Submission ADD COLUMN employee_phone TEXT;");
    if (!names.includes('image_url')) _db.exec("ALTER TABLE Submission ADD COLUMN image_url TEXT;");
    if (!names.includes('video_url')) _db.exec("ALTER TABLE Submission ADD COLUMN video_url TEXT;");
    if (!names.includes('file_url')) _db.exec("ALTER TABLE Submission ADD COLUMN file_url TEXT;");
  } catch (e) { console.error("Migration error:", e); }

  return _db;
}

module.exports = { getDb };
