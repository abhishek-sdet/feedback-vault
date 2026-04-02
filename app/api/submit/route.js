import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getDb } from '../../../lib/db.cjs';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const content = formData.get('content')?.toString();
    const employeeName = formData.get('employee_name')?.toString() || null;
    const employeeEmail = formData.get('employee_email')?.toString() || null;
    const employeePhone = formData.get('employee_phone')?.toString() || null;
    const isAnonymous = formData.get('is_anonymous') === 'true' ? 1 : 0;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Handle File Uploads
    const saveFile = async (fileKey) => {
      const file = formData.get(fileKey);
      if (!file || typeof file === 'string') return null;
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name);
      const fileName = `${randomUUID()}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      return `/uploads/${fileName}`;
    };

    const imageUrl = await saveFile('image');
    const videoUrl = await saveFile('video');
    const fileUrl = await saveFile('file');

    // Smart Classification Logic (Backend)
    const GRIEVANCE_KEYWORDS = [
      'broken', 'issue', 'problem', 'bad', 'hate', 'fail',
      'error', 'slow', 'angry', 'worst', 'stuck', 'help',
      'not working', 'stress', 'pressure', 'burnout', 'anxiety',
      'frustrated', 'can\'t', 'cannot', 'doesn\'t', 'wrong'
    ];

    const IDEA_KEYWORDS = [
      'idea', 'innovate', 'propose', 'suggest', 'improve', 
      'better', 'future', 'think', 'concept', 'plan',
      'strategy', 'potential', 'maybe', 'what if'
    ];

    const classifyFeedback = (text) => {
      const lower = text.toLowerCase();
      if (GRIEVANCE_KEYWORDS.some(kw => lower.includes(kw))) return 'GRIEVANCE';
      if (IDEA_KEYWORDS.some(kw => lower.includes(kw))) return 'IDEA';
      return 'FEEDBACK';
    };

    const type = classifyFeedback(content);

    const db = getDb();
    const id = randomUUID();

    db.prepare(
      `INSERT INTO Submission (id, type, content, status, created_at, employee_name, is_anonymous, employee_email, employee_phone, image_url, video_url, file_url)
       VALUES (?, ?, ?, 'UNREAD', datetime('now'), ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, type, content.trim(), employeeName, isAnonymous, employeeEmail, employeePhone, imageUrl, videoUrl, fileUrl);

    return NextResponse.json(
      { success: true, message: 'Message securely moved to the vault' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Vault transmission failed' }, { status: 500 });
  }
}
