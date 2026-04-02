const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'prisma');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, 'dev.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS Submission (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'UNREAD',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Database created successfully at:', dbPath);
db.close();
