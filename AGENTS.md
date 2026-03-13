# DevRoast

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Biome (lint + format)
- pnpm

## Estrutura
```
src/
├── app/                    # Next.js App Router
│   ├── components/        # Página de componentes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # HomePage
├── components/
│   ├── home/              # Componentes específicos da Home
│   ├── layout/             # Navbar, etc
│   └── ui/                # Componentes UI genéricos
└── lib/                   # Utilitários (shiki, etc)
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
