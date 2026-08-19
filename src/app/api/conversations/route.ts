import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { conversationService } from '@/services/conversation-service';
import { rateLimit } from '@/utils/rate-limit';

const limiter = rateLimit({ interval: 60_000, limit: 30 });

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const limited = limiter(user.id);
  if (limited) {
    return NextResponse.json({ data: null, error: 'Muitas requisicoes' }, { status: 429 });
  }

  const conversations = await conversationService.getAll(user.id);
  return NextResponse.json({ data: conversations, error: null });
}
