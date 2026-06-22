/**
 * Supabase Keep-Alive Heartbeat
 * ─────────────────────────────
 * Defence layers:
 *  1. REST API wake-up (with retries) before any DB attempt.
 *  2. Tries every Supabase connection mode in order:
 *       a. Transaction Pooler  — host:pooler port:6543  user:postgres.<ref>
 *       b. Session Pooler      — host:pooler port:5432  user:postgres.<ref>
 *       c. Direct DB IPv4      — host:db.<ref> port:5432  user:postgres
 *       d. Direct DB (alt)     — host:db.<ref> port:5432  user:postgres.<ref>
 *  3. Each attempt retried up to MAX_RETRIES times with exponential back-off.
 *  4. Script ALWAYS exits 0 — DB issues are logged as warnings, never crash CI.
 */

'use strict';

const { Client } = require('pg');
const dns        = require('dns');
const https      = require('https');

// ─── IPv4 first (GitHub Actions runners have flaky IPv6) ────────────────────
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();

// ─── tunables ────────────────────────────────────────────────────────────────
const CONNECT_TIMEOUT_MS = 20_000;
const MAX_RETRIES        = 3;       // per connection mode
const RETRY_BASE_MS      = 3_000;   // base delay for exponential back-off
const REST_RETRIES       = 3;
const REST_WAIT_AFTER_MS = 6_000;   // pause after successful REST wake-up

// ─── helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** HTTPS GET → resolves to HTTP status code or an error string. Never rejects. */
function httpsGet(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 12_000 }, (res) => {
      res.resume(); // drain body so socket is released
      resolve(res.statusCode);
    });
    req.on('error',   (e) => resolve(`ERR:${e.message}`));
    req.on('timeout', ()  => { req.destroy(); resolve('ERR:timeout'); });
  });
}

/**
 * Parse postgresql://user:pass@host:port/db robustly.
 * The regex greedily captures the password (everything between first ':' after
 * '://' and the LAST '@' before the hostname) so special chars are handled.
 */
function parseConnectionString(cs) {
  // Split on the last '@' before the host section
  const atIdx = cs.lastIndexOf('@');
  if (atIdx === -1) throw new Error('No "@" found in connection string.');

  const beforeAt = cs.slice(0, atIdx);   // postgresql://user:pass
  const afterAt  = cs.slice(atIdx + 1);  // host:port/db?params

  const credMatch = beforeAt.match(/^postgres(?:ql)?:\/\/([^:]+):(.+)$/);
  if (!credMatch) throw new Error('Cannot parse user:password from connection string.');

  const hostMatch = afterAt.match(/^([^:/]+):(\d+)\/([^?#]*)/);
  if (!hostMatch) throw new Error('Cannot parse host:port/database from connection string.');

  const [, user, rawPassword]      = credMatch;
  const [, host, port, database]   = hostMatch;

  return {
    user,
    password: decodeURIComponent(rawPassword),
    host,
    port    : parseInt(port, 10),
    database: database || 'postgres',
  };
}

/** Extract Supabase project reference from a parsed config. */
function extractProjectRef(cfg) {
  // From pooler username: postgres.<project-ref>
  if (cfg.user.includes('.')) {
    return cfg.user.split('.').slice(1).join('.');
  }
  // From direct host: db.<project-ref>.supabase.co
  if (cfg.host.startsWith('db.') && cfg.host.includes('supabase')) {
    return cfg.host.split('.')[1];
  }
  return null;
}

/** Attempt to wake the project via its REST API; returns true if HTTP < 500. */
async function restWakeUp(projectRef) {
  const url = `https://${projectRef}.supabase.co/rest/v1/`;
  console.log(`\n⏰  Waking project via REST: ${url}`);

  for (let attempt = 1; attempt <= REST_RETRIES; attempt++) {
    const status = await httpsGet(url);
    if (typeof status === 'number' && status < 500) {
      console.log(`   REST ping OK (HTTP ${status}) on attempt ${attempt}/${REST_RETRIES}.`);
      console.log(`   Waiting ${REST_WAIT_AFTER_MS / 1000}s for DB to fully wake…`);
      await sleep(REST_WAIT_AFTER_MS);
      return true;
    }
    console.warn(`   REST ping attempt ${attempt}/${REST_RETRIES}: ${status}`);
    if (attempt < REST_RETRIES) await sleep(2_000 * attempt);
  }

  console.warn('   REST wake-up inconclusive — will attempt DB connection anyway.');
  return false;
}

/** Try one pg Client connection; resolves to true on success, false on failure. */
async function tryConnect(label, clientConfig) {
  const client = new Client({
    ...clientConfig,
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const res = await client.query('SELECT NOW() AS db_time, version() AS db_version;');
    const row = res.rows[0];
    console.log(`\n✅  SUCCESS via [${label}]`);
    console.log(`   DB Time    : ${row.db_time}`);
    console.log(`   DB Version : ${(row.db_version || '').split(',')[0]}`);
    await client.end().catch(() => {});
    return true;
  } catch (err) {
    console.warn(`   ⚠️  [${label}] → [${err.code || 'ERR'}] ${err.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

/** Retry a connection attempt with exponential back-off. */
async function tryWithRetries(label, clientConfig) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`   Attempt ${attempt}/${MAX_RETRIES} for [${label}]…`);
    const ok = await tryConnect(label, clientConfig);
    if (ok) return true;
    if (attempt < MAX_RETRIES) {
      const delay = RETRY_BASE_MS * attempt;
      console.log(`   Retrying in ${delay / 1000}s…`);
      await sleep(delay);
    }
  }
  return false;
}

// ─── main ────────────────────────────────────────────────────────────────────

async function keepAlive() {
  console.log('════════════════════════════════════════');
  console.log('  Supabase Keep-Alive Heartbeat');
  console.log(`  ${new Date().toISOString()}`);
  console.log('════════════════════════════════════════');

  // ── 1. Resolve connection string ────────────────────────────────────────────
  const raw = (
    process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || ''
  ).trim();

  if (!raw) {
    console.warn('⚠️  DATABASE_URL is not set — skipping DB heartbeat.');
    console.warn('   Add the secret to GitHub: Settings → Secrets → DATABASE_URL');
    console.log('\n─── Heartbeat skipped (no URL) ───');
    process.exit(0); // ← intentional: don't break CI over a missing secret
  }

  let cfg;
  try {
    cfg = parseConnectionString(raw);
  } catch (e) {
    console.warn(`⚠️  Could not parse DATABASE_URL: ${e.message}`);
    console.warn('   Expected format: postgresql://postgres.<ref>:<pass>@<pooler-host>:6543/postgres');
    console.log('\n─── Heartbeat skipped (bad URL format) ───');
    process.exit(0); // ← don't break CI over a mis-configured secret
  }

  // ── 2. Print diagnostics (no passwords) ─────────────────────────────────────
  console.log(`\nHost     : ${cfg.host}`);
  console.log(`Port     : ${cfg.port}`);
  console.log(`User     : ${cfg.user}`);
  console.log(`Database : ${cfg.database}`);
  console.log(`Pass len : ${cfg.password.length} chars`);

  if (!cfg.user.includes('.')) {
    console.warn('⚠️  Username has no dot — pooler may need format postgres.<project-ref>');
  }

  const projectRef = extractProjectRef(cfg);
  console.log(`Project  : ${projectRef || '(could not extract)'}`);

  // ── 3. DNS check ─────────────────────────────────────────────────────────────
  const ip = await new Promise((resolve) =>
    dns.lookup(cfg.host, (err, addr) => resolve(err ? null : addr))
  );
  console.log(`Resolved : ${ip || 'FAILED'}`);

  // ── 4. REST wake-up (best-effort) ───────────────────────────────────────────
  if (projectRef) {
    await restWakeUp(projectRef);
  } else {
    console.warn('⚠️  No project ref — skipping REST wake-up.');
  }

  // ── 5. Build all connection modes to try ────────────────────────────────────
  //
  //  Mode A — exactly what was in DATABASE_URL (may already be any mode)
  //  Mode B — Session Pooler (same pooler host, port 5432)
  //  Mode C — Direct DB (db.<ref>.supabase.co, port 5432, user=postgres)
  //  Mode D — Direct DB variant (same host, user with project ref)
  //
  const isPooler = cfg.host.includes('pooler');

  const modes = [
    {
      label : 'A: URL as-is (transaction pooler / direct)',
      config: { ...cfg },
    },
  ];

  if (isPooler && cfg.port === 6543) {
    modes.push({
      label : 'B: Session Pooler (same host, port 5432)',
      config: { ...cfg, port: 5432 },
    });
  }

  if (projectRef) {
    modes.push({
      label : `C: Direct DB (db.${projectRef}.supabase.co:5432, user=postgres)`,
      config: {
        ...cfg,
        host    : `db.${projectRef}.supabase.co`,
        port    : 5432,
        user    : 'postgres',
      },
    });
    modes.push({
      label : `D: Direct DB (db.${projectRef}.supabase.co:5432, user=postgres.${projectRef})`,
      config: {
        ...cfg,
        host    : `db.${projectRef}.supabase.co`,
        port    : 5432,
        user    : `postgres.${projectRef}`,
      },
    });
  }

  // ── 6. Try each mode ─────────────────────────────────────────────────────────
  console.log(`\nTrying ${modes.length} connection mode(s) with up to ${MAX_RETRIES} retries each…\n`);

  let anySuccess = false;

  for (const { label, config } of modes) {
    console.log(`── Mode [${label}]`);
    console.log(`   ${config.user}@${config.host}:${config.port}/${config.database}`);
    const ok = await tryWithRetries(label, config);
    if (ok) {
      anySuccess = true;
      break; // no need to try more modes
    }
    console.log(); // blank line between modes
  }

  // ── 7. Summary ───────────────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════');
  if (anySuccess) {
    console.log('  ✅  Heartbeat COMPLETE — Supabase is alive.');
  } else {
    console.warn('  ⚠️  All connection modes failed — DB may be paused or credentials outdated.');
    console.warn('  Action: Log in to https://supabase.com → resume your project,');
    console.warn('          then update the DATABASE_URL secret with the fresh connection string.');
    console.warn('  ℹ️  This workflow will NOT be marked as failed — it is a best-effort ping.');
  }
  console.log('════════════════════════════════════════');

  process.exit(0); // ← ALWAYS exit 0 — keep-alive is best-effort
}

keepAlive().catch((err) => {
  // Catch any unhandled promise rejection — still exit 0
  console.error('Unexpected error:', err.message);
  process.exit(0);
});
