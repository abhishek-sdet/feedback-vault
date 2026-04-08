const { Pool } = require('pg');
const dns = require('dns');

// Force IPv4 as GitHub Actions often has issues with IPv6 resolution (ENETUNREACH)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();

async function keepAlive() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('Error: DATABASE_URL is not set.');
    process.exit(1);
  }

  // Only run for Postgres connections
  if (!connectionString.startsWith('postgres://') && !connectionString.startsWith('postgresql://')) {
    console.log('Skipping keep-alive: Not a Postgres connection.');
    return;
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('--- Supabase Keep-Alive Heartbeat ---');
    console.log(`Time: ${new Date().toISOString()}`);
    
    // Execute a trivial query to keep the project active
    const res = await pool.query('SELECT 1 as heartbeat');
    
    if (res.rows[0].heartbeat === 1) {
      console.log('Success: Database heartbeat sent successfully.');
    } else {
      console.warn('Warning: Unexpected heartbeat result.');
    }
  } catch (error) {
    console.error('Error: Heartbeat failed.', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

keepAlive();
