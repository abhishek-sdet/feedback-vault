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
    console.log(`Port: ${url.port || '5432'}`);

    // Log resolution for debugging
    const ip = await new Promise((resolve) => {
      dns.lookup(hostname, (err, address) => {
        resolve(err ? 'Resolution Failed' : address);
      });
    });
    console.log(`Resolved to: ${ip}`);

    const pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 15000, // Wait up to 15s to connect
      ssl: { 
        rejectUnauthorized: false,
        require: true 
      }
    });

    console.log('Connecting to database...');
    // Execute query
    const start = Date.now();
    const res = await pool.query('SELECT current_timestamp, version();');
    const duration = Date.now() - start;
    
    if (res.rows[0]) {
      console.log('Success: Database heartbeat sent successfully.');
      console.log(`DB Time: ${res.rows[0].current_timestamp}`);
      console.log(`DB Version: ${res.rows[0].version.split(',')[0]}`);
      console.log(`Query Duration: ${duration}ms`);
    }
    await pool.end();
    console.log('--- Heartbeat Complete ---');
  } catch (error) {
    console.error('Error: Heartbeat failed.');
    console.error(`Message: ${error.message}`);
    if (error.code) console.error(`Code: ${error.code}`);
    
    if (error.message.includes('ENETUNREACH')) {
      console.error('CRITICAL: Network unreachable. This often means the runner cannot reach the IPv6 address.');
      console.error('ACTION: Ensure you are using the Transaction Pooler URL (usually port 6543) which provides an IPv4 address.');
    }
    
    if (error.message.includes('timeout')) {
      console.error('CRITICAL: Connection timed out. The database might be paused or slow to wake up.');
    }

    process.exit(1);
  }
}

keepAlive();
