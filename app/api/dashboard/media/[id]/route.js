import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db.cjs';
import fs from 'fs/promises';
import path from 'path';

async function isAuthorized(request) {
  const db = await getDb();
  const res = await db.prepare("SELECT value FROM Registry WHERE key = 'DASHBOARD_SECRET'").get();
  const secret = res?.value || process.env.DASHBOARD_SECRET || 'Sdet@2024';
  return request.headers.get('Authorization') === secret;
}

export async function GET(request, { params }) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized Vault Access' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Filename required' }, { status: 400 });

  try {
    const filePath = path.join(process.cwd(), 'vault_storage', id);
    
    // Safety check: Ensure the file is within the vault_storage directory
    if (!filePath.startsWith(path.join(process.cwd(), 'vault_storage'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(id).toLowerCase();
    
    let contentType = 'application/octet-stream';
    if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.mov') contentType = 'video/quicktime';
    else if (ext === '.pdf') contentType = 'application/pdf';

    return new NextResponse(fileBuffer, {
      headers: { 'Content-Type': contentType }
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found in vault' }, { status: 404 });
  }
}
