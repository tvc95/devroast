import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLineNumbers,
} from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { Table, TableCell, TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

const codeLines = sampleCode.split("\n");

export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-page)] p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Componentes UI
        </h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Button
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              Botões com múltiplas variantes e tamanhos
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" size="sm">
              Default SM
            </Button>
            <Button variant="default" size="md">
              Default MD
            </Button>
            <Button variant="default" size="lg">
              Default LG
            </Button>
            <Button variant="secondary" size="md">
              Secondary
            </Button>
            <Button variant="outline" size="md">
              Outline
            </Button>
            <Button variant="ghost" size="md">
              Ghost
            </Button>
            <Button variant="destructive" size="md">
              Destructive
            </Button>
            <Button variant="link" size="md">
              Link
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 border-t border-[var(--border)] pt-6">
            <span className="text-sm text-[var(--text-tertiary)]">
              Estado: disabled
            </span>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Toggle
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">Alternador</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Toggle pressed>roast mode</Toggle>
            <Toggle>roast mode</Toggle>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Badge
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              Indicadores de status
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Badge variant="critical">critical</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="good">good</Badge>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Card
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              Card de análise/feedback
            </p>
          </div>
          <Card>
            <CardHeader>
              <Badge variant="critical">critical</Badge>
            </CardHeader>
            <CardTitle>using var instead of const/let</CardTitle>
            <CardDescription>
              The var keyword is function-scoped rather than block-scoped, which
              can lead to unexpected behavior and bugs. modern javascript uses
              const for immutable bindings and let for mutable ones.
            </CardDescription>
          </Card>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              CodeBlock
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              Bloco de código com shiki (server component)
            </p>
          </div>
          <CodeBlock>
            <CodeBlockHeader fileName="calculate.js" />
            <CodeBlockBody>
              <CodeBlockLineNumbers lineCount={codeLines.length} />
              <CodeBlockContent>{sampleCode}</CodeBlockContent>
            </CodeBlockBody>
          </CodeBlock>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              DiffLine
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              Linhas de diff (removed, added, context)
            </p>
          </div>
          <div className="flex flex-col rounded border border-[var(--border-primary)] bg-[var(--bg-input)]">
            <DiffLine type="removed" code="var total = 0;" />
            <DiffLine type="added" code="const total = 0;" />
            <DiffLine
              type="context"
              code="for (let i = 0; i < items.length; i++) {"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              Table
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              Tabela (leaderboard)
            </p>
          </div>
          <Table>
            <TableRow>
              <TableCell className="w-10">
                <span className="font-mono text-[13px] text-[var(--text-tertiary)]">
                  #1
                </span>
              </TableCell>
              <TableCell className="w-16">
                <span className="font-mono text-[13px] font-bold text-[var(--accent-red)]">
                  2.1
                </span>
              </TableCell>
              <TableCell className="flex-1">
                <span className="font-mono text-[12px] text-[var(--text-secondary)]">
                  function calculateTotal...
                </span>
              </TableCell>
              <TableCell className="w-24">
                <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                  javascript
                </span>
              </TableCell>
            </TableRow>
          </Table>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              ScoreRing
            </h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              Anel de pontuação com gradiente
            </p>
          </div>
          <div className="flex flex-wrap gap-8">
            <ScoreRing score={3.5} size="sm" />
            <ScoreRing score={3.5} size="md" />
            <ScoreRing score={3.5} size="lg" />
          </div>
        </section>
      </div>
    </main>
  );
}
