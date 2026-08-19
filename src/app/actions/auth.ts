'use server';

import { redirect } from 'next/navigation';
import { createServerClient, getSession } from '@/lib/supabase/server';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  return redirect('/chat');
}

export async function registerAction(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = createServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  return redirect('/login?message=Verifique seu email para confirmar o cadastro');
}

export async function logoutAction() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  return redirect('/login');
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}
