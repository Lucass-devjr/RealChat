import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { messageService } from '@/services/message-service';
import { editMessageSchema } from '@/schemas/message';
import { rateLimit } from '@/utils/rate-limit';

const limiter = rateLimit({ interval: 60_000, limit: 20 });

export async function PATCH(
  req: NextRequest,
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
  const body = await req.json();
  const parsed = editMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: 'Dados invalidos' }, { status: 400 });
  }

  try {
    const message = await messageService.edit(id, user.id, parsed.data.content);
    return NextResponse.json({ data: message, error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Mensagem nao encontrada ou sem permissao' }, { status: 404 });
  }
}

export async function DELETE(
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

  try {
    await messageService.delete(id, user.id);
    return NextResponse.json({ data: { success: true }, error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Mensagem nao encontrada ou sem permissao' }, { status: 404 });
  }
}
