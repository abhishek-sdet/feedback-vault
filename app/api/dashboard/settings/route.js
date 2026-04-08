import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db.cjs';

async function isAuthorized(request) {
  const db = await getDb();
  const res = await db.prepare("SELECT value FROM Registry WHERE key = 'DASHBOARD_SECRET'").get();
  const secret = res?.value || process.env.DASHBOARD_SECRET || 'Sdet@2026';
  return request.headers.get('Authorization') === secret;
}

// GET: Fetch current settings (protected)
export async function GET(request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const res = await db.prepare("SELECT value FROM Registry WHERE key = 'DASHBOARD_SECRET'").get();
  
  return NextResponse.json({ 
    accessKey: res?.value || 'Sdet@2026'
  });
}

// POST: Update settings (protected)
export async function POST(request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { newKey } = await request.json();
    if (!newKey || newKey.length < 4) {
      return NextResponse.json({ error: 'Key must be at least 4 characters.' }, { status: 400 });
    }

    const db = await getDb();
    await db.prepare("INSERT INTO Registry (key, value) VALUES ('DASHBOARD_SECRET', ?) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value").run(newKey);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
