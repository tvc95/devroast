# DevRoast

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Biome (lint + format)
- pnpm
- tRPC + TanStack Query (API layer)
- Drizzle ORM (database)
- number-flow (animated numbers)

## Estrutura
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (tRPC)
│   ├── components/        # Página de componentes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # HomePage
├── components/
│   ├── home/              # Componentes específicos da Home
│   ├── layout/            # Navbar, etc
│   └── ui/               # Componentes UI genéricos
├── server/                # tRPC server (init, router)
├── trpc/                  # tRPC client + utilities
└── db/                    # Drizzle ORM (schema, connection)
```

## Padrões

### Componentes UI
- Usar `tailwind-variants` para variantes
- Usar `twMerge` para merge de classes
- Usar padrão de composição (Root + Sub-componentes)
- Variáveis CSS: `bg-[var(--nome)]`, `text-[var(--nome)]`
- Named exports apenas
- forwardRef sempre

### CSS
- Fonte: JetBrains Mono (mono), Sistema (sans)
- Dark mode como padrão
- Variáveis em `@theme` no globals.css

### tRPC
- Ver `src/trpc/AGENTS.md`

### Specs
- Ver `specs/AGENTS.md`

### Homepage
- Ver `src/components/home/AGENTS.md`
