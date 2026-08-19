import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr';
import { publicEnv } from '@/lib/env';

export function createBrowserClient() {
  return createSSRBrowserClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
