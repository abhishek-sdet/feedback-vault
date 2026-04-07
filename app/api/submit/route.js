import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getDb } from '../../../lib/db.cjs';
import { encrypt } from '../../../lib/crypto';
import fs from 'fs/promises';
import path from 'path';

// --- Iron Vault Rate Limiting ---
const rateLimit = new Map();
const LIMIT = 5; // Max 5 submissions
const WINDOW = 60 * 1000; // per minute

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

    // --- Basic Sovereign Sanitization ---
    const sanitizedContent = content.trim()
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "[REMOVED_SCRIPT]")
      .replace(/<[^>]*>?/gm, ''); // Strip all other HTML tags

    // --- Hardened Encryption ---
    const employeeName = isAnonymous ? null : encrypt(rawName);
    const employeeEmail = isAnonymous ? null : encrypt(rawEmail);
    const employeePhone = isAnonymous ? null : encrypt(rawPhone);

    // --- Hardened File Uploads ---
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    
    const saveFile = async (fileKey) => {
      const file = formData.get(fileKey);
      if (!file || typeof file === 'string') return null;
      
      if (file.size > MAX_SIZE) {
        throw new Error(`File ${file.name} exceeds the 50MB vault limit.`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name).toLowerCase();
      
      // Basic extension whitelist
      const safeExts = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.pdf', '.doc', '.docx', '.txt', '.zip'];
      if (!safeExts.includes(ext)) {
        throw new Error('Unsupported or potentially malicious file format attempted.');
      }

      const fileName = `${randomUUID()}${ext}`;
      // MOVE STORAGE TO PRIVATE DIRECTORY
      const uploadDir = path.join(process.cwd(), 'vault_storage');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      
      return fileName; // Return filename only, to be proxied later
    };

    let imageUrl, videoUrl, fileUrl;
    try {
      imageUrl = await saveFile('image');
      videoUrl = await saveFile('video');
      fileUrl = await saveFile('file');
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const classifyFeedback = (text) => {
      const lower = text.toLowerCase();
      if (['broken', 'issue', 'problem', 'bad', 'fail', 'error', 'slow', 'stress', 'wrong', 'help'].some(kw => lower.includes(kw))) return 'GRIEVANCE';
      if (['idea', 'innovate', 'propose', 'suggest', 'improve', 'better', 'future', 'what if'].some(kw => lower.includes(kw))) return 'IDEA';
      return 'FEEDBACK';
    };

    const type = classifyFeedback(content);
    const db = getDb();
    const id = randomUUID();

    db.prepare(
      `INSERT INTO Submission (id, type, content, status, created_at, employee_name, is_anonymous, employee_email, employee_phone, image_url, video_url, file_url)
       VALUES (?, ?, ?, 'UNREAD', datetime('now'), ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, type, sanitizedContent, employeeName, isAnonymous, employeeEmail, employeePhone, imageUrl, videoUrl, fileUrl);

    return NextResponse.json({ success: true, message: 'Message securely moved to the vault' }, { status: 201 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Vault transmission failed' }, { status: 500 });
  }
}
