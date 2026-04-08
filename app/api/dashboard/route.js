import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db.cjs';
import { decrypt } from '../../../lib/crypto';
import { supabase } from '../../../lib/supabase';

async function isAuthorized(request) {
  const db = await getDb();
  const res = await db.prepare("SELECT value FROM Registry WHERE key = 'DASHBOARD_SECRET'").get();
  const secret = res?.value || process.env.DASHBOARD_SECRET || 'Sdet@2026';
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  return token === secret;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// GET: Fetch all submissions (protected)
export async function GET(request) {
  const start = Date.now();
  if (!(await isAuthorized(request))) {
    await sleep(1000);
    return NextResponse.json({ error: 'Unauthorized Vault Access' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const rows = await db
      .prepare(
        `SELECT id, type, content, status, created_at, employee_name, is_anonymous, employee_email, employee_phone, image_url, video_url, file_url
         FROM Submission ORDER BY created_at DESC`
      )
      .all();
    
    // Generate Signed URLs for attachments and decrypt fields
    const submissions = await Promise.all(rows.map(async (row) => {
      const getSignedUrl = async (path) => {
        if (!path) return null;
        const { data, error } = await supabase.storage
          .from('vault_attachments')
          .createSignedUrl(path, 3600); // 1 hour expiry
        return error ? null : data.signedUrl;
      };

      return {
        ...row,
        content: decrypt(row.content),
        employee_name: row.is_anonymous ? null : decrypt(row.employee_name),
        employee_email: row.is_anonymous ? null : decrypt(row.employee_email),
        employee_phone: row.is_anonymous ? null : decrypt(row.employee_phone),
        image_url: await getSignedUrl(row.image_url),
        video_url: await getSignedUrl(row.video_url),
        file_url: await getSignedUrl(row.file_url),
      };
    }));

    const end = Date.now();
    console.log(`[Dashboard] Fetch successful in ${end - start}ms`);

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('[Dashboard Error]:', error);
    return NextResponse.json({ 
      error: 'Vault retrieval failed', 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}

// PATCH: Update status (protected)
export async function PATCH(request) {
  if (!(await isAuthorized(request))) {
    await sleep(1000);
    return NextResponse.json({ error: 'Unauthorized Vault Access' }, { status: 401 });
  }
  try {
    const { id, status } = await request.json();
    const db = await getDb();
    await db.prepare('UPDATE Submission SET status = ? WHERE id = ?').run(status, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update vault entry' }, { status: 500 });
  }
}

// DELETE: Remove submission (protected)
export async function DELETE(request) {
  if (!(await isAuthorized(request))) {
    await sleep(1000);
    return NextResponse.json({ error: 'Unauthorized Vault Access' }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    const db = await getDb();
    
    // Optional: Also delete files from Supabase Storage here if needed
    
    await db.prepare('DELETE FROM Submission WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Entry permanently removed from vault' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete vault entry' }, { status: 500 });
  }
}
