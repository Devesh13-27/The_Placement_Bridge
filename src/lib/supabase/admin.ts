import { createClient as createServiceClient } from "@supabase/supabase-js";

// Service-role client — server-only. Bypasses RLS, so every call site must
// do its own authorization checks before touching the database with this.
export function createAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
