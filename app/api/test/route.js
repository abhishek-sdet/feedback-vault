import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db.cjs';

export async function GET() {
  try {
    console.log('[Test API] Attempting database connection...');
    const db = await getDb();
    
    // Simple query to verify connection
    const result = await db.prepare('SELECT 1 as connection_test').get();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      test_result: result,
      env: {
        has_db_url: !!process.env.DATABASE_URL,
        db_type: db.type
      }
    });
  } catch (error) {
    console.error('[Test API Error]:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
