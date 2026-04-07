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

  // Initialize Registry with default secret
  _db.exec(`
    CREATE TABLE IF NOT EXISTS Registry (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    INSERT OR IGNORE INTO Registry (key, value) VALUES ('DASHBOARD_SECRET', 'kapil-dev-access-key-2024');
  `);

  // Robust Submission Table Creation
  _db.exec(`
    CREATE TABLE IF NOT EXISTS Submission (
      id TEXT PRIMARY KEY NOT NULL,
      feedbackId TEXT UNIQUE,
      content TEXT NOT NULL,
      category TEXT,
      urgency TEXT DEFAULT 'NORMAL',
      status TEXT DEFAULT 'RECEIVED',
      response TEXT,
      impact TEXT,
      isAnonymous INTEGER DEFAULT 1,
      senderName TEXT,
      department TEXT,
      location TEXT,
      sentiment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Migration Helper: Ensure new columns exist in existing databases
  try {
    const columns = _db.prepare("PRAGMA table_info(Submission)").all();
    const names = columns.map(c => c.name);
    
    const newColumns = [
      { name: 'feedbackId', type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
      { name: 'urgency', type: 'TEXT' },
      { name: 'response', type: 'TEXT' },
      { name: 'impact', type: 'TEXT' },
      { name: 'isAnonymous', type: 'INTEGER DEFAULT 1' },
      { name: 'senderName', type: 'TEXT' },
      { name: 'department', type: 'TEXT' },
      { name: 'location', type: 'TEXT' },
      { name: 'sentiment', type: 'TEXT' },
      { name: 'updated_at', type: 'TEXT DEFAULT (datetime(\'now\'))' }
    ];

    newColumns.forEach(col => {
      if (!names.includes(col.name)) {
        try {
          _db.exec(`ALTER TABLE Submission ADD COLUMN ${col.name} ${col.type};`);
        } catch (colErr) {
          // Ignore if already exists or other minor issues
        }
      }
    });
  } catch (e) { 
    console.error("Migration error:", e); 
  }

  return _db;
}

module.exports = { getDb };

