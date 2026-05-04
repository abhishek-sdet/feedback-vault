const { getDb } = require('./lib/db.cjs');
require('dotenv').config();

async function check() {
  const db = await getDb();
  const res = await db.prepare("SELECT value FROM Registry WHERE key = 'DASHBOARD_SECRET'").get();
  console.log('Current Dashboard Secret in DB:', res?.value);
  console.log('Env Dashboard Secret:', process.env.DASHBOARD_SECRET);
}

check().catch(console.error);
