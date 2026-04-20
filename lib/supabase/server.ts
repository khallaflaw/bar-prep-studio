import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./types";

/**
 * Supabase server client for use in Server Components, Route Handlers,
 * and Server Actions.
 *
 * In Next.js 15, `cookies()` returns a Promise, so this must be awaited.
 * Always create a fresh client per request — never share one across requests.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // `setAll` was called from a Server Component, where cookies cannot
            // be mutated. This can be safely ignored if a middleware is
            // refreshing the user's session.
          }
        },
      },
    },
  );
}
