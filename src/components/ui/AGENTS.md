# Padrões de Componentes UI

## Estrutura de Arquivos

```
src/components/ui/
├── AGENTS.md           # Este arquivo
└── [componente].tsx   # Componentes aqui
```

## Padrões de Implementação

### 1. Bibliotecas

- **tailwind-variants**: Para criar variantes de componentes
- **tailwind-merge**: Para fazer merge de classes (usar junto com tv)
- **clsx**: Para condicional strings (se necessário)

### 2. Padrão de Composição

Componentes que possuem "partes" internas (como container, header, content) devem usar o **padrão de composição**:

```tsx
// Table.tsx
export function Table({ children, className, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

export function TableHeader({ children, className, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

export function TableRow({ children, className, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

export function TableCell({ children, className, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}
```

**Uso:**
```tsx
<Table>
  <TableHeader />
  <TableRow>
    <TableCell>...</TableCell>
  </TableRow>
</Table>
```

### 3. Estrutura do Componente (Sem Composição)

```tsx
import { type ElementHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const componente = tv(
  {
    base: [...],
    variants: {
      variant: { ... },
      size: { ... },
    },
    defaultVariants: { ... },
  },
  {
    twMerge: true, // padrão
  },
);

export interface ComponenteProps
  extends ElementHTMLAttributes<HTMLElementElement>,
    VariantProps<typeof componente> {}

export const Componente = forwardRef<HTMLElementElement, ComponenteProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={componente({ variant, size, className })}
        {...props}
      />
    );
  },
);

Componente.displayName = "Componente";
```

### 3. Regras

- **Sempre usar named exports**: Nunca usar default export
- **Estender propriedades nativas**: Usar `type ElementHTMLAttributes<HTMLXXXElement>` para estender props nativas
- **forwardRef**: Sempre usar para permitir ref forwarding
- **displayName**: Sempre definir para melhor debugging
- **2 espaços de indentação**: Seguir padrão do Biome

### 4. Naming

- Nome do arquivo: `kebab-case.tsx`
- Nome do componente: `PascalCase`
- Variável do tv: `camelCase` (ex: `button`, `card`)

### 5. Propriedades

- `variant`: Para variações visuais (primary, secondary, outline, etc.)
- `size`: Para variações de tamanho (sm, md, lg)
- `className`: Para overrides específicos
- Todas as outras props são passadas para o elemento nativo

### 6. CSS/Tailwind

- **Variáveis CSS**: Usar o formato `bg-[var(--nome-da-variavel)]` para cores e backgrounds
- **Fonte padrão do texto**: `font-sans` (sistema)
- **Para texto monospaced**: usar `font-mono` (JetBrains Mono)
- **Exemplos de classes**:
  - `bg-[var(--bg-page)]` - background da página
  - `bg-[var(--bg-surface)]` - background de superfícies
  - `bg-[var(--bg-input)]` - background de inputs
  - `text-[var(--text-primary)]` - texto principal
  - `text-[var(--text-secondary)]` - texto secundário
  - `text-[var(--text-tertiary)]` - texto terciário
  - `border-[var(--border-primary)]` - borda primária
  - `bg-[var(--accent-green)]` - verde de destaque
  - `bg-[var(--accent-red)]` - vermelho de erro
  - `bg-[var(--accent-amber)]` - amarelo de alerta
