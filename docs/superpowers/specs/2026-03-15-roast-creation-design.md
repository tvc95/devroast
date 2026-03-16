# Feature: Criação de Roasts

## Overview

Permitir que usuários enviem trechos de código para análise da IA e recebam um "roast" (avaliação sarcástica ou construtiva) com score, verdict, quote, análise de problemas e diff de correção.

## Escopo

- [x] Input de código via CodeInput existente
- [x] Toggle roast mode (sarcástico vs construtivo)
- [x] Mutation tRPC para criar roast
- [x] Integração com SDK AI (Anthropic ou OpenAI)
- [x] Geração de diff (formato padrão)
- [x] Exibição de resultado na página `/roast/{id}`
- [ ] Share roast (fora do escopo)

## Arquitetura

```
Client (Home Page)
    │
    ▼ (code + roastMode)
tRPC Mutation: createRoast
    │
    ▼
SDK AI (generateText)
    │
    ▼
Database (roasts + analysis_items)
    │
    ▼
Redirect to /roast/{id}
```

## Funcionalidades

### 1. Input de Código

- Usar `CodeInput` existente da home page (`src/components/home/code-input.tsx`)
- Componente já tem: syntax highlighting, auto-detect de linguagem, limite 2000 chars
- Expor callback `onChange` para capturar código digitado

### 2. Toggle Roast Mode

- **Roast Mode (ON)**: Análise sarcástica, linguagem agressiva, maximum sarcasm
- **Normal Mode (OFF)**: Análise construtiva, feedback profissional
- Usar `ActionsBarToggle` existente em `src/components/home/actions-bar.tsx`
- Expor estado via `onPressedChange` para capturar valor

### 3. Mutation createRoast

**Input:**
```typescript
{
  code: string;      // código fonte
  language: string;   // linguagem detectada/selecionada
  roastMode: boolean; // true = sarcástico, false = construtivo
}
```

**Processo:**
1. Validar input (Zod)
2. Chamar SDK AI com prompt apropriado
3. Parsear resposta JSON
4. Gerar diff programaticamente
5. Salvar roast no banco
6. Salvar analysis_items
7. Retornar ID

**Output:**
```typescript
{ id: string } // UUID do roast criado
```

### 4. Análise IA

**Prompt Construction:**
- System prompt varia conforme roastMode
- User prompt inclui linguagem + código

**Expected Response (JSON):**
```json
{
  "score": 7.5,
  "verdict": "rough_around_edges",
  "roastQuote": "Este código tem mais buracos que um cheese Swiss",
  "suggestedCode": "código corrigido...",
  "issues": [
    {
      "severity": "critical",
      "title": "Variável não utilizada",
      "description": "A variável x nunca é usada"
    }
  ]
}
```

**Score Mapping:**
- 0-2: `needs_serious_help`
- 2-5: `rough_around_edges`
- 5-7: `decent_code`
- 7-9: `solid_work`
- 9-10: `exceptional`

### 5. Geração de Diff

- Usar biblioteca `diff` (npm: diff)
- Comparar: código original (`input.code`) vs código corrigido (`analysis.suggestedCode`)
- Se `suggestedCode` estiver vazio ou null, não gerar diff (armazenar string vazia)
- Gerar diff no formato padrão (unified diff)
- Formato de saída:
```diff
- linha removida
+ linha adicionada
```

**Exemplo de uso:**
```typescript
import { diffLines } from "diff";

const changes = diffLines(originalCode, suggestedCode);
// changes é um array de objetos com { value, added, removed }
```

**Tratamento de multi-line:**
- `diffLines` já trata múltiplas linhas corretamente
- Cada "chunk" de mudança contém as linhas afetadas
- Unir todos os chunks em uma única string de diff

### 6. Exibição na Página de Resultado

**Rota:** `/roast/[id]`

**Data Fetching:**
- Adicionar nova query `getRoastById` no router:
```typescript
getRoastById: baseProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ input }) => {
    const roast = await db.query.roasts.findFirst({
      where: eq(roasts.id, input.id),
      with: {
        analysisItems: {
          orderBy: [asc(analysisItems.order)],
        },
      },
    });
    return roast;
  })
);
```

**Componentes:**
- Header: score (0-10), verdict label
- Quote: roastQuote em destaque
- Analysis Items: lista de problemas com severity
- Suggested Fix: diff inline das correções

## Database Schema

**Nota:** As tabelas abaixo já estão definidas no schema (`src/db/schema.ts`) mas ainda não estão em uso (sem dados). Os campos são exatamente como definidos.

### roasts (schema defined)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| code | text | Código original |
| language | varchar(50) | Linguagem |
| lineCount | integer | Número de linhas |
| roastMode | boolean | Modo sarcástico |
| score | real | Score 0-10 |
| verdict | enum | Veredito |
| roastQuote | text | Quote sarcástico |
| suggestedFix | text | Diff em formato padrão |
| createdAt | timestamp | Data de criação |

### analysis_items (schema defined)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| roastId | uuid | FK -> roasts.id |
| severity | enum | critical/warning/good |
| title | varchar(200) | Título do problema |
| description | text | Descrição detalhada |
| order | integer | Ordem de exibição |

## Dependencies

```json
{
  "ai": "^4.0.0",
  "@ai-sdk/anthropic": "^1.0.0",
  "diff": "^7.0.0"
}
```

## Variáveis de Ambiente

```env
ANTHROPIC_API_KEY=sk-ant-...
# ou
OPENAI_API_KEY=sk-...
```

## UI/UX

### Fluxo
1. Usuário cola código no input
2. (Opcional) Seleciona linguagem
3. (Opcional) Toggle roast mode
4. Clica em "roast_my_code"
5. Loading state (texto: "roasting...")
6. Redirect para `/roast/{id}`
7. Exibição do resultado

### Loading State
- Botão mostra texto alterado: `$ roasting...`
- Botão desabilitado durante loading
- Cursor: wait

### Error States
- Toast de erro quando API falha
- Toast de erro quando timeout (30s)
- Toast de erro quando JSON parse falha após 2 retries
- Usuário pode tentar novamente após erro

### Página de Resultado
- Score em destaque (número grande)
- Verdict como badge
- Quote em itálico/destaque
- Lista de issues com ícones por severity
- Diff inline para suggested fix

## Estresse e Edge Cases

1. **Código vazio**: Validar no input, desabilitar submit
2. **Código muito longo**: Limite 2000 chars
3. **Linguagem inválida**: Fallback para "plaintext"
4. **API error**: Exibir mensagem de erro amigável (toast: "Algo deu errado. Tente novamente.")
5. **Timeout**: Implementar timeout na chamada IA (30s)
6. **JSON parse error**: 
   - Max 2 retries com novo request
   - Fallback: mensagem genérica "Não foi possível processar a análise. Tente novamente."
7. **suggestedCode vazio/null**: Não gerar diff, salvar string vazia em `suggestedFix`

## Success Criteria

- [ ] Usuário consegue enviar código
- [ ] Toggle roast mode altera tom da análise
- [ ] Resultado é salvo no banco
- [ ] Página de resultado exibe todos os dados
- [ ] Diff é gerado e exibido corretamente
- [ ] Loading state funciona durante submit
- [ ] Erros são tratados graciosamente
