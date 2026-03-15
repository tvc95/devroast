# Padrões do Servidor

## Estrutura de Arquivos

```
src/server/
├── index.ts         # tRPC init (initTRPC, context, helpers)
└── router.ts       # Root router + AppRouter type
```

## Padrões de Implementação

### 1. initTRPC (src/server/index.ts)

```typescript
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

### 2. Router (src/server/router.ts)

```typescript
import { createTRPCRouter, baseProcedure } from "./index";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { count, avg } from "drizzle-orm";

export const appRouter = createTRPCRouter({
  getStats: baseProcedure.query(async () => {
    const [result] = await db
      .select({
        totalRoasts: count(),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    return {
      totalRoasts: result.totalRoasts ?? 0,
      avgScore: result.avgScore ? Number(result.avgScore) : 0,
    };
  }),
});

export type AppRouter = typeof appRouter;
```

## Regras

- **Sempre usar cache para context**: `cache()` do React para evitar recriação em múltiplas chamadas
- **Typing**: Exportar `AppRouter` type para uso no cliente
- **Procedures**: Usar `baseProcedure` como base, criar procedures específicos se necessário
- **Drizzle**: Queries direto no procedure, sem camada adicional para queries simples
