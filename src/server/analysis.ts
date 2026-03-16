import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export type Severity = "critical" | "warning" | "good";

export interface AnalysisItem {
  severity: Severity;
  title: string;
  description: string;
}

export type Verdict =
  | "needs_serious_help"
  | "rough_around_edges"
  | "decent_code"
  | "solid_work"
  | "exceptional";

export interface RoastAnalysis {
  score: number;
  verdict: Verdict;
  roastQuote: string;
  suggestedCode: string;
  items: AnalysisItem[];
}

const SYSTEM_PROMPT_NORMAL = `You are a professional code reviewer. Analyze the code and respond ONLY with valid JSON, no other text. Use this exact schema:

{
  "score": <number 0-10>,
  "verdict": "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work" | "exceptional",
  "roastQuote": "<short constructive feedback quote>",
  "suggestedCode": "<corrected version of the code>",
  "issues": [
    {"severity": "critical" | "warning" | "good", "title": "<short title>", "description": "<description>"}
  ]
}`;

const SYSTEM_PROMPT_ROAST = `You are a brutal code reviewer who roasts terrible code mercilessly. Analyze the code and respond ONLY with valid JSON, no other text. Use this exact schema:

{
  "score": <number 0-10>,
  "verdict": "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work" | "exceptional",
  "roastQuote": "<savage sarcastic roast quote>",
  "suggestedCode": "<corrected version of the code>",
  "issues": [
    {"severity": "critical" | "warning" | "good", "title": "<short title>", "description": "<description>"}
  ]
}`;

function parseJsonWithRetry(
  text: string,
  maxRetries: number,
): RoastAnalysis | null {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) continue;

      const parsed = JSON.parse(jsonMatch[0]);

      if (
        typeof parsed.score !== "number" ||
        !parsed.verdict ||
        !parsed.roastQuote ||
        !parsed.suggestedCode ||
        !Array.isArray(parsed.issues)
      ) {
        continue;
      }

      return {
        score: Math.max(0, Math.min(10, parsed.score)),
        verdict: parsed.verdict,
        roastQuote: parsed.roastQuote,
        suggestedCode: parsed.suggestedCode,
        items: parsed.issues.map((item: unknown) => ({
          severity: (item as { severity: Severity }).severity || "warning",
          title: (item as { title: string }).title || "Issue",
          description: (item as { description: string }).description || "",
        })),
      };
    } catch {}
  }
  return null;
}

export async function generateRoastAnalysis(
  code: string,
  language: string,
  roastMode: boolean,
): Promise<RoastAnalysis> {
  const system = roastMode ? SYSTEM_PROMPT_ROAST : SYSTEM_PROMPT_NORMAL;

  const { text } = await generateText({
    model: google("gemini-flash-latest"),
    system,
    prompt: `Language: ${language}\n\nCode:\n${code}`,
  });

  const parsed = parseJsonWithRetry(text, 2);

  if (!parsed) {
    throw new Error("Failed to parse AI response");
  }

  return parsed;
}
