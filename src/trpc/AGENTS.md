# Padrões tRPC

## Estrutura de Arquivos

```
src/
├── server/
│   ├── index.ts           # tRPC init (initTRPC, context)
│   └── router.ts          # Root router + AppRouter type
├── trpc/
│   ├── client.ts          # TRPCProvider + trpc hooks (useQuery, useMutation)
│   ├── query-client.ts    # QueryClient singleton
│   └── server.ts          # Server utilities (prefetches)
└── app/api/trpc/[trpc]/
    └── route.ts           # Fetch adapter handler
```

## Padrões de Implementação

### 1. Servidor (src/server/)

```typescript
// src/server/index.ts
import { initTRPC } from "@trpc/server";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  return { db };
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

```typescript
// src/server/router.ts
import { createTRPCRouter, baseProcedure } from "./index";

export const appRouter = createTRPCRouter({
  procedureName: baseProcedure.query(async () => { ... }),
});

export type AppRouter = typeof appRouter;
```

### 2. API Route (src/app/api/trpc/[trpc]/route.ts)

```typescript
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/server";
import { appRouter } from "@/server/router";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 3. Client Provider (src/trpc/client.tsx)

```typescript
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { getQueryClient } from "./query-client";
import type { AppRouter } from "@/server/router";

export const trpc = createTRPCReact<AppRouter>();

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

### 4. Query Client (src/trpc/query-client.ts)

```typescript
import { QueryClient } from "@tanstack/react-query";

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
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  return (clientQueryClientSingleton ??= makeQueryClient());
}
```

### 5. Server Utilities (src/trpc/server.ts)

```typescript
import "server-only";

import { cache } from "react";
import { appRouter } from "@/server/router";
import { createTRPCContext, createCallerFactory } from "@/server";
import { QueryClient } from "@tanstack/react-query";

export const getQueryClient = cache(makeQueryClient);

export const caller = {
  getStats: async () => {
    const ctx = await createTRPCContext();
    const c = createCallerFactory(appRouter)(ctx);
    return c.getStats();
  },
};
```

## Uso em Componentes

### Client Component com useQuery

```tsx
import { trpc } from "@/trpc/client";

export function MyComponent() {
  const { data, isLoading } = trpc.myProcedure.useQuery();
  
  if (isLoading) return <Skeleton />;
  
  return <div>{data}</div>;
}
```

### Server Component com Prefetch

```tsx
import { caller } from "@/trpc/server";

export default async function Page() {
  const data = await caller.myProcedure();
  
  return <ClientComponent data={data} />;
}
```

## Regras

- **Sempre usar named exports**
- **Provider no layout raiz**: Adicionar `TRPCProvider` em `src/app/layout.tsx`
- **server-only**: Arquivos server-only devem ter `import "server-only"`
- **Tipos**: Exportar `AppRouter` type do router para uso no cliente
- **Nomenclatura**: Procedimentos em camelCase (ex: `getStats`, `createRoast`)

## Dependências

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query
pnpm add server-only
```
