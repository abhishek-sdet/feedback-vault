import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tefsmieopnulkqrkvgfs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnNtaWVvcG51bGtxcmt2Z2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDAwMjAsImV4cCI6MjA5MTIxNjAyMH0.V8Od3-DVCyMoEaqQBMs2aHfy6qXJQnKJzKB7lw1xhks';

export const supabase = createClient(supabaseUrl, supabaseKey);
