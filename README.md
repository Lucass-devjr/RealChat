# RealChat

Plataforma de mensagens em tempo real construida com Next.js 14, Supabase e Prisma.

## Funcionalidades

- Autenticacao com email/senha e Google OAuth
- Conversas individuais e em grupo
- Envio, edicao e exclusao de mensagens
- Resposta a mensagens (reply)
- Indicador de status online/offline
- Gerenciamento de contatos
- Busca de contatos e conversas
- Tema claro/escuro
- Design responsivo

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS v3, shadcn/ui (Radix UI)
- **Backend**: Next.js API Routes, Prisma 5
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticacao**: Supabase Auth
- **Validacao**: Zod v4
- **Testes**: Vitest, Playwright

## Arquitetura

```
src/
├── app/              # Pages e API routes (App Router)
├── components/       # Componentes UI (shadcn/ui + custom)
├── hooks/            # Custom hooks
├── lib/              # Prisma, Supabase, utils
├── repositories/     # Camada de acesso a dados
├── schemas/          # Schemas Zod para validacao
├── services/         # Logica de negocio
├── tests/            # Testes unitarios
├── types/            # Tipos TypeScript
└── utils/            # Utilitarios (format, rate-limit, api)
```

## Configuracao

### Pre-requisitos

- Node.js 20+
- Projeto Supabase configurado

### Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
DATABASE_URL=sua_database_url
```

### Instalacao

```bash
npm install
npx prisma generate
npm run dev
```

### Banco de Dados

Execute o SQL em `supabase/migrations/001_initial_schema.sql` no Supabase SQL Editor.

### Testes

```bash
npm run test          # Testes unitarios
npm run test:e2e      # Testes E2E
npm run test:coverage # Cobertura
```

### Build

```bash
npm run build
npm run start
```

## Scripts

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run lint` | Lint com ESLint |
| `npm run typecheck` | Verificacao de tipos |
| `npm run test` | Testes unitarios |
| `npm run format` | Formatar codigo |

## Licenca

MIT
