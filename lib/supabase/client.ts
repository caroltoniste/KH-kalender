import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Singleton instance
let clientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createClient() {
  // Return existing instance if available
  if (clientInstance) {
    return clientInstance;
  }

  // Create new instance only if none exists
  clientInstance = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return clientInstance;
}
