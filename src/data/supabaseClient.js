const { createClient } = require('@supabase/supabase-js');

const projectId = process.env.SUPABASE_PROJECT_ID || '';
const supabaseUrl =
  process.env.SUPABASE_URL ||
  (projectId ? `https://${projectId}.supabase.co` : '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

let supabase = null;
let mode = 'disabled';

if (supabaseUrl && serviceRoleKey) {
  supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  mode = 'service_role';
} else if (supabaseUrl && anonKey) {
  // Fallback mode for testing; production server should use service_role key.
  supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  mode = 'anon_or_publishable';
}

function getSupabase() {
  return supabase;
}

function isSupabaseEnabled() {
  return Boolean(supabase);
}

function getSupabaseMode() {
  return mode;
}

module.exports = {
  getSupabase,
  isSupabaseEnabled,
  getSupabaseMode,
  supabaseUrl
};
