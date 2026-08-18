import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components and browser-side interactions.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
