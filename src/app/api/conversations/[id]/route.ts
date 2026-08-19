import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { conversationService } from '@/services/conversation-service';
import { rateLimit } from '@/utils/rate-limit';

const limiter = rateLimit({ interval: 60_000, limit: 30 });

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const limited = limiter(user.id);
  if (limited) {
    return NextResponse.json({ data: null, error: 'Muitas requisicoes' }, { status: 429 });
  }

  const { id } = await params;
  const conversation = await conversationService.getById(id, user.id);

  if (!conversation) {
    return NextResponse.json({ data: null, error: 'Conversa nao encontrada' }, { status: 404 });
  }

  return NextResponse.json({ data: conversation, error: null });
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const { id } = await params;
  await conversationService.markAsRead(id, user.id);

  return NextResponse.json({ data: { success: true }, error: null });
}
