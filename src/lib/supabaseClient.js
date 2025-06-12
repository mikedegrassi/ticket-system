// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lijlyefysdaqbltgyinf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpamx5ZWZ5c2RhcWJsdGd5aW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODgyMzMsImV4cCI6MjA2NTE2NDIzM30.P6KJFMcFp1GLEwjo1TBqLGYkL8NtzyjtaVqyuuJhUpw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
