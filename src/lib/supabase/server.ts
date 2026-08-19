import { createServerClient as createSSRServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { publicEnv } from '@/lib/env';

export function createServerClient() {
  const cookieStore = cookies();
  return createSSRServerClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // ignore in Server Components
          }
        });
      },
    },
  });
}

export async function getSession() {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser() {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
