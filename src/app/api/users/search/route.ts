import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { userRepository } from '@/repositories/user-repository';
import { rateLimit } from '@/utils/rate-limit';

const limiter = rateLimit({ interval: 60_000, limit: 20 });

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const limited = limiter(user.id);
  if (limited) {
    return NextResponse.json({ data: null, error: 'Muitas requisicoes' }, { status: 429 });
  }

  const email = req.nextUrl.searchParams.get('email');
  if (!email || email.length < 3) {
    return NextResponse.json({ data: null, error: 'Query muito curta' }, { status: 400 });
  }

  const users = await userRepository.searchByEmail(email, user.id);
  return NextResponse.json({ data: users, error: null });
}
