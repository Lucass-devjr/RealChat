import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { conversationService } from '@/services/conversation-service';
import { messageService } from '@/services/message-service';
import { sendMessageSchema } from '@/schemas/message';
import { rateLimit } from '@/utils/rate-limit';

const getLimiter = rateLimit({ interval: 60_000, limit: 60 });
const postLimiter = rateLimit({ interval: 60_000, limit: 30 });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const limited = getLimiter(user.id);
  if (limited) {
    return NextResponse.json({ data: null, error: 'Muitas requisicoes' }, { status: 429 });
  }

  const { id } = await params;
  const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined;

  const result = await conversationService.getMessages(id, cursor);
  return NextResponse.json({ data: result, error: null });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const limited = postLimiter(user.id);
  if (limited) {
    return NextResponse.json({ data: null, error: 'Muitas requisicoes' }, { status: 429 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = sendMessageSchema.safeParse({ ...body, conversationId: id });
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: 'Dados invalidos' }, { status: 400 });
  }

  const message = await messageService.send({
    conversationId: id,
    senderId: user.id,
    content: parsed.data.content,
    replyToId: parsed.data.replyToId,
  });
  return NextResponse.json({ data: message, error: null }, { status: 201 });
}
