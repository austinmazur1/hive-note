import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

/** For API routes: create a Supabase client authenticated with the Clerk token */
export function createSupabaseClientWithToken(accessToken: string | null) {
  if (!accessToken) throw new Error("Token required");
  return createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: async () => accessToken,
  });
}