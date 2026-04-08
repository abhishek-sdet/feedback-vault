const path = require('path');
const fs = require('fs');

let _db = null;
let _pool = null;

/**
 * Universal DB Wrapper to abstract SQLite vs Postgres differences
 */
class DBWrapper {
  constructor(client, type) {
    this.client = client;
    this.type = type; // 'sqlite' or 'postgres'
  }

  async exec(sql) {
    if (this.type === 'sqlite') {
      return this.client.exec(sql);
    } else {
      return this.client.query(sql);
    }
  }

  prepare(sql) {
    // Normalize SQL (Postgres uses $1, $2; SQLite uses ?)
    let count = 0;
    const pgSql = this.type === 'postgres' 
      ? sql.replace(/\?/g, () => `$${++count}`) 
      : sql;

    return {
      run: (...args) => {
        if (this.type === 'sqlite') {
          return this.client.prepare(sql).run(...args);
        } else {
          return this.client.query(pgSql, args);
        }
      },
      get: async (...args) => {
        if (this.type === 'sqlite') {
          return this.client.prepare(sql).get(...args);
        } else {
          const res = await this.client.query(pgSql, args);
          return res.rows[0];
        }
      },
      all: async (...args) => {
        if (this.type === 'sqlite') {
          return this.client.prepare(sql).all(...args);
        } else {
          const res = await this.client.query(pgSql, args);
          return res.rows;
        }
      }
    };
  }
}

async function getDb() {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;

  // --- PostgreSQL Logic (Cloud/Netlify) ---
  if (connectionString && (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://'))) {
    const { Pool } = require('pg'); // Lazy-load pg
    if (!_pool) {
      console.log('[DB] Connecting to Supabase pool...');
      _pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 5000, // Fail fast if connection hangs
        ssl: { rejectUnauthorized: false } 
      });
      console.log('[DB] Connection pool established.');
    }
    _db = new DBWrapper(_pool, 'postgres');
    
    // Initialize tables if needed
    try {
      await _db.exec(`CREATE TABLE IF NOT EXISTS Registry (key TEXT PRIMARY KEY, value TEXT)`);
      await _db.exec(`INSERT INTO Registry (key, value) VALUES ('DASHBOARD_SECRET', 'Sdet@2026') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
      await _db.exec(`
        CREATE TABLE IF NOT EXISTS Submission (
          id TEXT PRIMARY KEY, 
          type TEXT, 
          content TEXT, 
          status TEXT DEFAULT 'UNREAD', 
          created_at TIMESTAMPTZ DEFAULT NOW(), 
          employee_name TEXT, 
          is_anonymous INTEGER DEFAULT 1, 
          employee_email TEXT, 
          employee_phone TEXT, 
          image_url TEXT, 
          video_url TEXT, 
          file_url TEXT
        );
      `);
    } catch (err) {
      console.error('[DB Init Error]:', err.message);
      // Don't crash here, let the actual query fail with a better error
    }
    return _db;
  }

  // --- SQLite Logic (Local Dev) ---
  const Database = require('better-sqlite3'); // Lazy-load better-sqlite3
  const dbDir = path.join(process.cwd(), 'prisma');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const dbPath = path.join(dbDir, 'dev.db');
  const sqlite = new Database(dbPath);
  _db = new DBWrapper(sqlite, 'sqlite');

  await _db.exec(`CREATE TABLE IF NOT EXISTS Registry (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)`);
  await _db.exec(`INSERT INTO Registry (key, value) VALUES ('DASHBOARD_SECRET', 'Sdet@2026') ON CONFLICT(key) DO UPDATE SET value=excluded.value`);
  await _db.exec(`
    CREATE TABLE IF NOT EXISTS Submission (
      id TEXT PRIMARY KEY NOT NULL, 
      type TEXT, 
      content TEXT NOT NULL, 
      status TEXT DEFAULT 'UNREAD', 
      created_at TEXT DEFAULT (datetime('now')), 
      employee_name TEXT, 
      is_anonymous INTEGER DEFAULT 1, 
      employee_email TEXT, 
      employee_phone TEXT, 
      image_url TEXT, 
      video_url TEXT, 
      file_url TEXT
    );
  `);

  return _db;
}

module.exports = { getDb };
