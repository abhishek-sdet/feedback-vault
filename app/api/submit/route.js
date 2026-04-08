import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getDb } from '../../../lib/db.cjs';
import { encrypt } from '../../../lib/crypto';
import { supabase } from '../../../lib/supabase';

// --- Iron Vault Rate Limiting ---
const rateLimit = new Map();
const LIMIT = 10;
const WINDOW = 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const userData = rateLimit.get(ip) || { count: 0, firstTrack: now };
  if (now - userData.firstTrack > WINDOW) {
    userData.count = 1;
    userData.firstTrack = now;
  } else {
    userData.count++;
  }
  rateLimit.set(ip, userData);
  return userData.count <= LIMIT;
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many vault submissions. Please wait 1 minute.' }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const content = formData.get('content')?.toString();
    const rawName = formData.get('employee_name')?.toString() || null;
    const rawEmail = formData.get('employee_email')?.toString() || null;
    const rawPhone = formData.get('employee_phone')?.toString() || null;
    const isAnonymous = formData.get('is_anonymous') === 'true' ? 1 : 0;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const sanitizedContent = content.trim()
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "[REMOVED_SCRIPT]")
      .replace(/<[^>]*>?/gm, '');

    const employeeName = isAnonymous ? null : encrypt(rawName);
    const employeeEmail = isAnonymous ? null : encrypt(rawEmail);
    const employeePhone = isAnonymous ? null : encrypt(rawPhone);

    // --- Supabase Storage Integration ---
    const MAX_SIZE = 50 * 1024 * 1024;
    
    const uploadToSupabase = async (fileKey) => {
      const file = formData.get(fileKey);
      if (!file || typeof file === 'string') return null;
      if (file.size > MAX_SIZE) throw new Error(`File ${file.name} exceeds the 50MB vault limit.`);

      const buffer = await file.arrayBuffer();
      const ext = file.name.split('.').pop().toLowerCase();
      const fileName = `${randomUUID()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from('vault_attachments')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (error) {
        console.error(`Supabase Upload Error [${fileKey}]:`, error);
        throw new Error('Vault storage refused the transmission.');
      }
      return data.path; // Store the relative path
    };

    let imageUrl, videoUrl, fileUrl;
    try {
      imageUrl = await uploadToSupabase('image');
      videoUrl = await uploadToSupabase('video');
      fileUrl = await uploadToSupabase('file');
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const classifyFeedback = (text) => {
      const lower = text.toLowerCase();
      if (['broken', 'issue', 'problem', 'bad', 'fail', 'error', 'slow', 'stress', 'wrong', 'help'].some(kw => lower.includes(kw))) return 'GRIEVANCE';
      if (['idea', 'innovate', 'propose', 'suggest', 'improve', 'better', 'future'].some(kw => lower.includes(kw))) return 'IDEA';
      return 'FEEDBACK';
    };

    const type = classifyFeedback(sanitizedContent);
    const encryptedContent = encrypt(sanitizedContent);
    const db = await getDb();
    const id = randomUUID();
    const now = new Date().toISOString();

    await db.prepare(
      `INSERT INTO Submission (id, type, content, status, created_at, employee_name, is_anonymous, employee_email, employee_phone, image_url, video_url, file_url)
       VALUES (?, ?, ?, 'UNREAD', ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, type, encryptedContent, now, employeeName, isAnonymous, employeeEmail, employeePhone, imageUrl, videoUrl, fileUrl);

    return NextResponse.json({ success: true, message: 'Message securely moved to the vault' }, { status: 201 });
  } catch (error) {
    console.error('[Submission Error]:', error);
    return NextResponse.json({ 
      error: 'Vault transmission failed', 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}
