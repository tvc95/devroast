import { diffLines, Change } from "diff";

export { parseDiff } from "@/lib/diff";

export function generateDiff(original: string, suggested: string): string {
  if (!suggested || suggested.trim() === "") {
    return "";
  }

  const changes: Change[] = diffLines(original, suggested);

  let diff = "```diff\n";

  for (const change of changes) {
    const lines = change.value.split("\n");
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === lines.length - 1 && line === "") {
        continue;
      }

      if (change.added) {
        diff += `+ ${line}\n`;
      } else if (change.removed) {
        diff += `- ${line}\n`;
      } else {
        diff += `  ${line}\n`;
      }
    }
  }

  diff += "```";

  return diff;
}
