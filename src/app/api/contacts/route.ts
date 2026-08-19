import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { contactService } from '@/services/contact-service';
import { addContactSchema } from '@/schemas/contact';
import { rateLimit } from '@/utils/rate-limit';

const getLimiter = rateLimit({ interval: 60_000, limit: 30 });
const postLimiter = rateLimit({ interval: 60_000, limit: 10 });

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const limited = getLimiter(user.id);
  if (limited) {
    return NextResponse.json({ data: null, error: 'Muitas requisicoes' }, { status: 429 });
  }

  const contacts = await contactService.getAll(user.id);
  return NextResponse.json({ data: contacts, error: null });
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ data: null, error: 'Nao autorizado' }, { status: 401 });
  }

  const limited = postLimiter(user.id);
  if (limited) {
    return NextResponse.json({ data: null, error: 'Muitas requisicoes' }, { status: 429 });
  }

  const body = await req.json();
  const parsed = addContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: 'Email invalido' }, { status: 400 });
  }

  try {
    const result = await contactService.add(user.id, parsed.data.email);
    return NextResponse.json({ data: result, error: null }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao adicionar contato';
    return NextResponse.json({ data: null, error: message }, { status: 400 });
  }
}
