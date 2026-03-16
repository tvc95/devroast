export type DiffLineType = "added" | "removed" | "context";

export interface DiffLine {
  type: DiffLineType;
  content: string;
}

/**
 * Parses a unified diff string (as produced by generateDiff) into
 * an array of structured DiffLine objects, ready for rendering.
 *
 * Input format expected:
 *   ```diff
 *   + added line
 *   - removed line
 *     context line
 *   ```
 */
export function parseDiff(diffString: string): DiffLine[] {
  if (!diffString) return [];

  const result: DiffLine[] = [];

  for (const line of diffString.split("\n")) {
    if (line.startsWith("```")) continue;

    if (line.startsWith("+ ") && !line.startsWith("+++")) {
      result.push({ type: "added", content: line.slice(2) });
    } else if (line.startsWith("- ") && !line.startsWith("---")) {
      result.push({ type: "removed", content: line.slice(2) });
    } else if (line.trim()) {
      result.push({ type: "context", content: line.trimStart() });
    }
  }

  return result;
}