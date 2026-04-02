import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db.cjs';
import { decrypt } from '../../../lib/crypto';

function isAuthorized(request) {
  const db = getDb();
  const secret = db.prepare("SELECT value FROM Registry WHERE key = 'DASHBOARD_SECRET'").get()?.value 
                || process.env.DASHBOARD_SECRET 
                || 'Sdet@2026';
  return request.headers.get('Authorization') === secret;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// GET: Fetch all submissions (protected)
export async function GET(request) {
  if (!isAuthorized(request)) {
    // Brute-force protection: slow down failed attempts
    await sleep(1000);
    return NextResponse.json({ error: 'Unauthorized Vault Access' }, { status: 401 });
  }

  try {
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT id, type, content, status, created_at, employee_name, is_anonymous, employee_email, employee_phone, image_url, video_url, file_url
         FROM Submission ORDER BY created_at DESC`
      )
      .all();
    
    // Decrypt sensitive fields for the dashboard
    const submissions = rows.map(row => ({
      ...row,
      employee_name: row.is_anonymous ? null : decrypt(row.employee_name),
      employee_email: row.is_anonymous ? null : decrypt(row.employee_email),
      employee_phone: row.is_anonymous ? null : decrypt(row.employee_phone),
    }));

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Vault retrieval failed' }, { status: 500 });
  }
}

// PATCH: Update status (protected)
export async function PATCH(request) {
  if (!isAuthorized(request)) {
    await sleep(1000);
    return NextResponse.json({ error: 'Unauthorized Vault Access' }, { status: 401 });
  }
  try {
    const { id, status } = await request.json();
    const db = getDb();
    db.prepare('UPDATE Submission SET status = ? WHERE id = ?').run(status, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update vault entry' }, { status: 500 });
  }
}

// DELETE: Remove submission (protected)
export async function DELETE(request) {
  if (!isAuthorized(request)) {
    await sleep(1000);
    return NextResponse.json({ error: 'Unauthorized Vault Access' }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    const db = getDb();
    db.prepare('DELETE FROM Submission WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Entry permanently removed from vault' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete vault entry' }, { status: 500 });
  }
}
