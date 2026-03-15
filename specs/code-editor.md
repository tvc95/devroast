# Especificação: Editor de Código com Syntax Highlight

## 1. Visão Geral

Editor de código com syntax highlighting para a homepage do DevRoast. Permite que o usuário cole um trecho de código e visualize com cores de acordo com a linguagem detectada automaticamente, com opção de selecionar manualmente a linguagem.

---

## 2. Referência: Ray.so

O editor de referência é o [ray.so](https://ray.so) (código aberto em [raycast/ray-so](https://github.com/raycast/ray-so)).

### Arquitetura do Ray.so

| Componente | Tecnologia |
|------------|------------|
| Syntax Highlighting | **Shiki** (shiki/wasm) com `getHighlighterCore` |
| Detecção de Linguagem | **highlight.js** (`highlightAuto`) |
| Estado | Jotai (atoms) |
| UI | Componentes React customizados |

### Fluxo de Funcionamento

```
1. Usuário cola código no textarea
2. highlight.js detecta automaticamente a linguagem
3. Shiki aplica o syntax highlighting
4. Código resaltado é renderizado como HTML sobre o textarea
```

---

## 3. Análise de Alternativas

### Shiki

| Prós | Contras |
|------|---------|
| Same engine as VS Code (TextMate grammars) | Não tem detecção automática nativa |
| Excelente qualidade de highlighting | Requer carregar linguagens dinamicamente |
| Suporte a 200+ linguagens | Pode ser grande (~1.2MB gz) |
| Temas do VS Code | Requer async/await |
| Server-side rendering possível | WASM pode ter overhead inicial |
| Usado por VitePress, Astro, Nuxt | |

### highlight.js

| Prós | Contras |
|------|---------|
| Detecção automática nativa | Qualidade inferior ao Shiki |
| 190+ linguagens | Temas menos sofisticados |
| Mais leve que Shiki completo | |
| Mais fácil de integrar | |

### Prism.js

| Prós | Contras |
|------|---------|
| 300+ linguagens | Cliente-side only |
| Excelente ecossistema de plugins | Qualidade média de highlighting |
| Extensível | Requer manipulação de DOM |

### Recomendação

**Shiki + highlight.js** (mesma arquitetura do ray.so):
- Shiki para rendering de alta qualidade
- highlight.js para detecção automática de linguagem

---

## 4. Arquitetura Proposta

### Stack

- **Syntax Highlighting**: `shiki` com `shiki/wasm`
- **Detecção de Linguagem**: `highlight.js`
- **Estado**: Zustand (já usado no projeto)
- **UI**: Componentes customizados (padrão do projeto)

### Componentes

```
src/components/editor/
├── CodeEditor.tsx        # Componente principal (textarea + highlighted overlay)
├── HighlightedCode.tsx   # Rendering do código com Shiki
├── LanguageSelector.tsx   # Dropdown de seleção de linguagem
├── useCodeHighlighter.ts # Hook para gerenciar Shiki
└── useLanguageDetector.ts # Hook para detectar linguagem
```

### Fluxo de Dados

```
User Input (paste/type)
       ↓
[codeAtom] ← Zustand store
       ↓
useLanguageDetector (highlight.js)
       ↓
[detectedLanguageAtom]
       ↓
useCodeHighlighter (Shiki)
       ↓
[highlightedHtml]
       ↓
Render: textarea (edição) + div (overlay highlight)
```

---

## 5. Funcionalidades

### Obrigatórias

- [ ] Área de texto para entrada de código
- [ ] Syntax highlighting em tempo real (aplicar imediatamente ao colar)
- [ ] Detecção automática de linguagem ao colar código
- [ ] Selector dropdown para selecionar linguagem manualmente
- [ ] Suporte às linguagens populares (JS, TS, Python, Rust, Go, HTML, CSS, JSON, YAML, Markdown, Bash, SQL) - carregadas sob demanda
- [ ] Tema vesper (padrão do projeto)

### Opcionais (Futuro)

- [ ] Temas de cores alternativos
- [ ] Exportação de imagem (como o ray.so)
- [ ] Título/filename
- [ ] Padding ajustável
- [ ] Bordas/frames alternativos

---

## 6. Integração com Homepage

O editor será integrado na homepage como parte da experiência do usuário. Ver especificação de layout em `src/app/page.tsx`.

---

## 7. Questões em Aberto

### ❓ Pergunta 1: Quais linguagens devem ser suportadas inicialmente?

**Resposta**: Subset popular carregado sob demanda.

Linguagens iniciais:
- JavaScript
- TypeScript
- Python
- Rust
- Go
- HTML
- CSS
- JSON
- YAML
- Markdown
- Bash/Shell
- SQL

### ❓ Pergunta 2: Como será a experiência de paste?

**Resposta**: Detectar e aplicar highlight imediatamente ao colar.

### ❓ Pergunta 3: O editor deve ter modo de edição visual ou apenas visualização?

**Resposta**: Apenas modo de edição (usuário cola e vê o resultado com highlight).

### ❓ Pergunta 4: Quantos temas de cores devemos suportar?

**Resposta**: Usar o mesmo tema do projeto (vesper) para manter consistência visual.

### ❓ Pergunta 5: O componente será usado apenas na homepage ou também em outras páginas?

**Resposta**: Apenas na homepage.

---

## 8. To-Dos para Implementação

- [ ] **TASK-1**: Instalar dependências (`shiki`, `highlight.js`)
- [ ] **TASK-2**: Criar store Zustand para estado do editor
- [ ] **TASK-3**: Implementar hook `useLanguageDetector` com highlight.js (subset de linguagens)
- [ ] **TASK-4**: Implementar hook `useCodeHighlighter` com Shiki (carregamento sob demanda)
- [ ] **TASK-5**: Criar componente `CodeEditor` (textarea + overlay highlight)
- [ ] **TASK-6**: Criar componente `LanguageSelector` (dropdown)
- [ ] **TASK-7**: Aplicar highlight imediatamente ao detectar input/paste
- [ ] **TASK-8**: Usar tema vesper (padrão do projeto)
- [ ] **TASK-9**: Integrar na homepage
- [ ] **TASK-10**: Testar com linguagens do subset (JS, TS, Python, Rust, Go, HTML, CSS, JSON, YAML, Markdown, Bash, SQL)
- [ ] **TASK-11**: Ajustar estilos para manter consistência com o design system
