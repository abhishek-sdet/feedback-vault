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

  // Extract hostname from connection string to force IPv4 resolution
  const url = new URL(connectionString);
  const hostname = url.hostname;

  try {
    console.log('--- Supabase Keep-Alive Heartbeat ---');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Target Host: ${hostname}`);

    // Manually resolve to IPv4 to bypass GitHub Actions IPv6 issues
    const ipv4 = await new Promise((resolve, reject) => {
      dns.resolve4(hostname, (err, addresses) => {
        if (err || !addresses.length) reject(new Error(`Failed to resolve ${hostname} to IPv4`));
        else resolve(addresses[0]);
      });
    });

    console.log(`Resolved IPv4: ${ipv4}`);
    
    // Create new modified connection string with IP
    const targetUrl = new URL(connectionString);
    targetUrl.hostname = ipv4;

    const pool = new Pool({
      connectionString: targetUrl.toString(),
      ssl: { rejectUnauthorized: false }
    });

    // Execute a trivial query to keep the project active
    const res = await pool.query('SELECT 1 as heartbeat');
    
    if (res.rows[0].heartbeat === 1) {
      console.log('Success: Database heartbeat sent successfully via IPv4.');
    } else {
      console.warn('Warning: Unexpected heartbeat result.');
    }
    await pool.end();
  } catch (error) {
    console.error('Error: Heartbeat failed.', error.message);
    process.exit(1);
  }
}

keepAlive();
