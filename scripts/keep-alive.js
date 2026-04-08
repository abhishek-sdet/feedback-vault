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

  const url = new URL(connectionString);
  const hostname = url.hostname;

  try {
    console.log('--- Supabase Keep-Alive Heartbeat ---');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Target: ${hostname}`);

    // Log resolution for debugging
    const ip = await new Promise((resolve) => {
      dns.lookup(hostname, (err, address) => {
        resolve(err ? 'Resolution Failed' : address);
      });
    });
    console.log(`Resolved to: ${ip}`);

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    // Execute query
    const res = await pool.query('SELECT 1 as heartbeat');
    
    if (res.rows[0].heartbeat === 1) {
      console.log('Success: Database heartbeat sent successfully.');
    }
    await pool.end();
  } catch (error) {
    console.error('Error: Heartbeat failed.', error.message);
    if (error.message.includes('ENETUNREACH')) {
      console.error('CRITICAL: Network unreachable. Ensure you have updated DATABASE_URL to the IPv4 Transaction Pooler URL.');
    }
    process.exit(1);
  }
}

keepAlive();
