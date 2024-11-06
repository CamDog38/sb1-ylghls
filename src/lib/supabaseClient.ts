import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sksnsccgxfotoxpnxvib.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrc25zY2NneGZvdG94cG54dmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTcxMzYsImV4cCI6MjA0NjM5MzEzNn0.GvlnvfdfwHD2CFLWs3VV4bDauD7rM6U0Y0cVZnwWgBQ';

export const supabase = createClient(supabaseUrl, supabaseKey);