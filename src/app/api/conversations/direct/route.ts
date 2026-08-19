import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { conversationService } from '@/services/conversation-service';
import { createDirectSchema } from '@/schemas/conversation';
import { rateLimit } from '@/utils/rate-limit';

const limiter = rateLimit({ interval: 60_000, limit: 10 });

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const limited = limiter(user.id);
  if (limited) {
    return NextResponse.json({ data: null, error: 'Muitas requisicoes' }, { status: 429 });
  }

  const body = await req.json();
  const parsed = createDirectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: 'Dados invalidos' }, { status: 400 });
  }

  const conversation = await conversationService.createDirect(user.id, parsed.data.userId);
  return NextResponse.json({ data: conversation, error: null }, { status: 201 });
}
