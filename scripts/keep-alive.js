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

  // Extract hostname from connection string
  const url = new URL(connectionString);
  const hostname = url.hostname;

  try {
    console.log('--- Supabase Keep-Alive Heartbeat ---');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Target Host: ${hostname}`);

    // Use dns.lookup which is more compatible with OS-level host resolution
    const records = await new Promise((resolve) => {
      dns.lookup(hostname, { all: true }, (err, addresses) => {
        if (err || !addresses.length) {
          console.warn(`Warning: Standard DNS lookup failed for ${hostname}.`);
          resolve([]);
        } else {
          resolve(addresses);
        }
      });
    });

    console.log('Available Records:', JSON.stringify(records));
    
    // Prioritize IPv4 but allow fallback
    const ipv4Record = records.find(r => r.family === 4);
    let finalConnectionString = connectionString;

    if (ipv4Record) {
      console.log(`Forcing IPv4: ${ipv4Record.address}`);
      const targetUrl = new URL(connectionString);
      targetUrl.hostname = ipv4Record.address;
      finalConnectionString = targetUrl.toString();
    } else {
      console.log('No IPv4 record found. Falling back to original hostname (IPv6 attempted).');
    }

    const pool = new Pool({
      connectionString: finalConnectionString,
      ssl: { rejectUnauthorized: false }
    });

    // Execute a trivial query to keep the project active
    const res = await pool.query('SELECT 1 as heartbeat');
    
    if (res.rows[0].heartbeat === 1) {
      console.log('Success: Database heartbeat sent successfully.');
    } else {
      console.warn('Warning: Unexpected heartbeat result.');
    }
    await pool.end();
  } catch (error) {
    console.error('Error: Heartbeat failed.', error.message);
    if (error.message.includes('ENETUNREACH')) {
      console.error('TIP: Your project host may be IPv6-only. Consider using the Supabase Transaction Pooler URL (IPv4) in your secrets.');
    }
    process.exit(1);
  }
}

keepAlive();
