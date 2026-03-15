# Padrões de Componentes Home

## Estrutura de Arquivos

```
src/components/home/
├── AGENTS.md                    # Este arquivo
├── actions-bar.tsx
├── code-input.tsx
├── footer-stats.tsx
├── footer-stats-content.tsx     # Client component com tRPC query
├── home-interactive.tsx         # Componentes interativos (useState)
├── leaderboard-preview.tsx
└── ...
```

## Padrões de Implementação

### 1. Separação Server/Client Components

A página home (`src/app/page.tsx`) é um **Server Component** que importa **Client Components** para partes interativas.

**Estrutura:**
- `page.tsx` → Server Component (sem estado, dados do servidor)
- `home-interactive.tsx` → Client Component (contém `useState`, event handlers)
- `footer-stats-content.tsx` → Client Component (contém `useQuery`)

### 2. Server Component (page.tsx)

```tsx
import { HomeInteractive } from "@/components/home/home-interactive";
import { FooterStatsContent } from "@/components/home/footer-stats-content";

export default function HomePage() {
  return (
    <main>
      <HomeInteractive />
      <FooterStats />
    </main>
  );
}
```

### 3. Client Component Interativo

Para componentes com event handlers (onClick, onChange), criar um wrapper:

```tsx
// src/components/home/home-interactive.tsx
"use client";

import { useState } from "react";
import { CodeInput } from "@/components/home/code-input";
import { ActionsBar, ActionsBarSubmit, ActionsBarToggle } from "@/components/home/actions-bar";

export function HomeInteractive() {
  const [submitEnabled, setSubmitEnabled] = useState(true);

  return (
    <>
      <CodeInput onSubmitEnabled={setSubmitEnabled} />
      <ActionsBar>
        <ActionsBarToggle>roast mode</ActionsBarToggle>
        <ActionsBarSubmit disabled={!submitEnabled}>
          $ roast_my_code
        </ActionsBarSubmit>
      </ActionsBar>
    </>
  );
}
```

### 4. Client Component com tRPC Query

Para queries que precisam de loading state com animação:

```tsx
// src/components/home/footer-stats-content.tsx
"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/client";

export function FooterStatsContent() {
  const { data } = trpc.getStats.useQuery();
  
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (data) {
      setValue(data.value);
    }
  }, [data]);

  return <NumberFlow value={value} />;
}
```

### 5. Animações com NumberFlow

Para números que devem anim do zero:

1. Usar `useState(0)` como valor inicial
2. `useEffect` para atualizar quando dados chegarem
3. `NumberFlow` faz a animação automaticamente

```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  if (data?.count !== undefined) {
    setCount(data.count);
  }
}, [data]);

<NumberFlow value={count} />
```

## Regras

- **Server Component como default**: `page.tsx` deve ser server component
- **"use client" apenas quando necessário**: Somente adicionar quando precisar de hooks ou event handlers
- **Separar responsabilidades**: Code input e ActionsBar ficam em wrapper separado
- **NumberFlow para animações**: Usar para números que precisam de transição visual
- **Named exports**: Nunca default exports
