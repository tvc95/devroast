# Padrões de API Routes

## Estrutura

```
src/app/api/
└── trpc/[trpc]/
    └── route.ts      # tRPC fetch adapter handler
```

## Padrão tRPC Handler

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

## Regras

- **Fetch adapter**: Usar `@trpc/server/adapters/fetch` para Next.js App Router
- **Endpoint**: `/api/trpc`
- **Métodos**: Exportar tanto GET quanto POST
