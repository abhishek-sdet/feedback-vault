const { Pool } = require('pg');
require('dotenv').config();

/**
 * TEST SUPABASE CONNECTION
 * 
 * This script verifies your connection to Supabase.
 * Make sure you have SUPABASE_DATABASE_URL in your .env.local 
 * or replace the connectionString below.
 */
async function testSupabase() {
  const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString || connectionString.startsWith('file:')) {
    console.error('❌ Error: No Postgres connection string found.');
    console.error('Please set SUPABASE_DATABASE_URL in .env.local or paste it in this script.');
    process.exit(1);
  }

  const url = new URL(connectionString);
  console.log('--- Supabase Connection Test ---');
  console.log(`Target Host: ${url.hostname}`);
  console.log(`Port: ${url.port || '5432'}`);

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting...');
    const start = Date.now();
    const res = await pool.query('SELECT now(), version();');
    const duration = Date.now() - start;
    
    console.log('✅ Connection Successful!');
    console.log(`DB Time: ${res.rows[0].now}`);
    console.log(`DB Version: ${res.rows[0].version.split(',')[0]}`);
    console.log(`Response Time: ${duration}ms`);
  } catch (err) {
    console.error('❌ Connection Failed!');
    console.error(`Message: ${err.message}`);
    if (err.code) console.error(`Postgres Code: ${err.code}`);
    
    if (err.message.includes('ENETUNREACH')) {
      console.log('\n💡 Tip: This looks like a network issue. Try using the Transaction Pooler URL (Port 6543).');
    }
  } finally {
    await pool.end();
    console.log('-------------------------------');
  }
}

testSupabase();
