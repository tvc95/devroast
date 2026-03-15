# Especificação: tRPC API Layer

## 1. Visão Geral

Camada de API typesafe usando tRPC com TanStack React Query no Next.js 16 (App Router). Permite chamadas API end-to-end typesafe entre client e server sem geração de código manual.

---

## 2. Stack

| Camada | Tecnologia |
|--------|------------|
| API Framework | `@trpc/server` |
| Client | `@trpc/client` + `@trpc/tanstack-react-query` |
| Data Fetching | TanStack Query (`@tanstack/react-query`) |
| Adapter | Fetch adapter (App Router) |

---

## 3. Estrutura de Arquivos

```
src/
├── app/
│   └── api/trpc/[trpc]/route.ts   # API route handler
├── server/
│   ├── index.ts                   # tRPC init (initTRPC, context)
│   └── router.ts                  # Root router
├── trpc/
│   ├── client.ts                  # createTRPCReact + TRPCProvider
│   ├── query-client.ts            # QueryClient singleton
│   └── server.ts                  # Server-side utilities (getQueryClient)
```

---

## 4. Instalação

```bash
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query
```

---

## 5. Implementação

### 5.1 Server — Context (`src/server/index.ts`)

```typescript
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  return {};
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

### 5.2 Server — Router (`src/server/router.ts`)

```typescript
import { createTRPCRouter, baseProcedure } from './index';

export const appRouter = createTRPCRouter({
  hello: baseProcedure.query(() => 'Hello World'),
  // ... routers
});

export type AppRouter = typeof appRouter;
```

### 5.3 API Route (`src/app/api/trpc/[trpc]/route.ts`)

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '~/server';
import { appRouter } from '~/server/router';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 5.4 Client — QueryClient (`src/trpc/query-client.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
      },
    },
  });
}

let clientQueryClientSingleton: QueryClient;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  return (clientQueryClientSingleton ??= makeQueryClient());
}
```

### 5.5 Client — TRPCProvider (`src/trpc/client.tsx`)

```typescript
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import { getQueryClient } from './query-client';
import type { AppRouter } from '~/server/router';

export const trpc = createTRPCReact<AppRouter>();

function getUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 5.6 Server — Utilities (`src/trpc/server.ts`)

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { getQueryClient } from './query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { AppRouter } from '~/server/router';

export { trpc, createTRPCProxyClient, httpBatchLink };
export { getQueryClient, dehydrate, HydrationBoundary };
export type { AppRouter };
```

---

## 6. Uso em Server Components

### Prefetch (Server Component)

```tsx
import { getQueryClient, trpc, HydrationBoundary, dehydrate } from '~/trpc/server';
import { ClientComponent } from './client-component';

export default async function Page() {
  const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
```

### Query (Client Component)

```tsx
import { trpc } from '~/trpc/client';

export function ClientComponent() {
  const { data } = trpc.hello.useQuery();
  return <div>{data}</div>;
}
```

### Mutation

```tsx
import { trpc } from '~/trpc/client';

export function MutationComponent() {
  const mutation = trpc.createRoast.useMutation();
  
  const handleClick = () => {
    mutation.mutate({ code: '...', language: 'javascript' });
  };
  
  return <button onClick={handleClick}>Submit</button>;
}
```

---

## 7. Integração com App

Adicionar `TRPCProvider` no layout raiz:

```tsx
// src/app/layout.tsx
import { TRPCProvider } from '~/trpc/client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
```

---

## 8. To-Dos para Implementação

- [ ] **TASK-1**: Instalar dependências (`@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`)
- [ ] **TASK-2**: Criar `src/server/index.ts` (tRPC init + context)
- [ ] **TASK-3**: Criar `src/server/router.ts` (root router)
- [ ] **TASK-4**: Criar API route `src/app/api/trpc/[trpc]/route.ts`
- [ ] **TASK-5**: Criar `src/trpc/query-client.ts`
- [ ] **TASK-6**: Criar `src/trpc/client.tsx` (TRPCProvider)
- [ ] **TASK-7**: Criar `src/trpc/server.ts` (utilities)
- [ ] **TASK-8**: Adicionar TRPCProvider no `layout.tsx`
- [ ] **TASK-9**: Criar routers exemplo (roast, leaderboard)
- [ ] **TASK-10**: Integrar com existing queries/mutations
