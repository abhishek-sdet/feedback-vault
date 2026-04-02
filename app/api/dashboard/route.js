import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db.cjs';

const DASHBOARD_SECRET = process.env.DASHBOARD_SECRET || 'kapil-dev-access-key-2024';

function isAuthorized(request) {
  const db = getDb();
  const secret = db.prepare("SELECT value FROM Registry WHERE key = 'DASHBOARD_SECRET'").get()?.value 
                || process.env.DASHBOARD_SECRET 
                || 'Sdet@2026';
  return request.headers.get('Authorization') === secret;
}

// GET: Fetch all submissions (protected)
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized Vault Access' }, { status: 401 });
  }
  try {
    const db = getDb();
    const submissions = db
      .prepare(
        `SELECT id, type, content, status, created_at, employee_name, is_anonymous, employee_email, employee_phone, image_url, video_url, file_url
         FROM Submission ORDER BY created_at DESC`
      )
      .all();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Vault retrieval failed' }, { status: 500 });
  }
}

// PATCH: Update status (protected)
export async function PATCH(request) {
  if (!isAuthorized(request)) {
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
