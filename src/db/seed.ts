import { config } from "dotenv";

config({ path: "../../../.env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(databaseUrl, {
  casing: "snake_case",
});

import { analysisItems, roasts } from "./schema";

const VERDICTS = [
  "needs_serious_help",
  "rough_around_edges",
  "decent_code",
  "solid_work",
  "exceptional",
] as const;

const SEVERITIES = ["critical", "warning", "good"] as const;

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "c",
  "cpp",
  "ruby",
  "php",
] as const;

const CODE_TEMPLATES = [
  `function add(a, b) { return a + b; }`,
  `const x = 10; if (x > 5) { console.log("big"); }`,
  `for (let i = 0; i < 10; i++) { console.log(i); }`,
  `async function fetchData() { return await fetch(url); }`,
  `const arr = [1, 2, 3].map(x => x * 2);`,
  `class User { constructor(name) { this.name = name; } }`,
  `const obj = { a: 1, b: 2, c: 3 };`,
  `try { doSomething(); } catch (e) { console.error(e); }`,
  `export default function App() { return <div>Hello</div>; }`,
  `const [state, setState] = useState(null);`,
];

const ROAST_QUOTES = [
  "This code is so bad, even your mother wouldn't approve it.",
  "I've seen better code in a fortune cookie.",
  "This is why we can't have nice things.",
  "Your code is like a fine wine... aged poorly.",
  "Stack Overflow called, they want their code back.",
  "This takes 'spaghetti code' to a whole new level.",
  "If coding were a sport, you'd be in the penalty box.",
  "Your linter just cried a little.",
  "This code has more bugs than a summer picnic.",
  "Congratulations, you invented a new circle of hell.",
];

const ANALYSIS_TITLES = [
  "Missing error handling",
  "Unused variable detected",
  "Magic numbers everywhere",
  "Function too long",
  "No type annotations",
  "Global state mutation",
  "Missing null checks",
  "Code duplication",
  "Poor naming convention",
  "Missing documentation",
];

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRoastData() {
  const score = parseFloat(
    faker.number.float({ min: 0, max: 10, fractionDigits: 1 }).toFixed(1),
  );
  const lineCount = faker.number.int({ min: 1, max: 100 });
  const language = randomElement(LANGUAGES);
  const roastMode = Math.random() > 0.3;
  const code = randomElement(CODE_TEMPLATES);

  let verdict: (typeof VERDICTS)[number];
  if (score <= 2) verdict = "needs_serious_help";
  else if (score <= 4) verdict = "rough_around_edges";
  else if (score <= 6) verdict = "decent_code";
  else if (score <= 8) verdict = "solid_work";
  else verdict = "exceptional";

  return {
    code,
    language,
    lineCount,
    roastMode,
    score,
    verdict,
    roastQuote: roastMode ? randomElement(ROAST_QUOTES) : null,
    suggestedFix: null,
    createdAt: faker.date.past({ years: 1 }),
  };
}

function generateAnalysisItems(roastId: string, score: number) {
  const itemCount = faker.number.int({ min: 2, max: 6 });
  const items = [];

  for (let i = 0; i < itemCount; i++) {
    let severity: (typeof SEVERITIES)[number];

    if (score <= 4) {
      severity =
        Math.random() > 0.3 ? randomElement(["critical", "warning"]) : "good";
    } else if (score <= 7) {
      severity =
        Math.random() > 0.5 ? "warning" : randomElement(["critical", "good"]);
    } else {
      severity = Math.random() > 0.6 ? "good" : "warning";
    }

    items.push({
      id: faker.string.uuid(),
      roastId,
      severity,
      title: randomElement(ANALYSIS_TITLES),
      description: faker.lorem.sentence(),
      order: i,
    });
  }

  return items;
}

async function seed() {
  console.log("🌱 Starting seed...");

  const roastCount = 100;
  const allRoasts = [];
  const allAnalysisItems = [];

  for (let i = 0; i < roastCount; i++) {
    const roastData = generateRoastData();
    const roastId = faker.string.uuid();

    allRoasts.push({
      id: roastId,
      ...roastData,
    });

    const items = generateAnalysisItems(roastId, roastData.score);
    allAnalysisItems.push(...items);
  }

  console.log(`📝 Inserting ${allRoasts.length} roasts...`);
  await db.insert(roasts).values(allRoasts);

  console.log(`📝 Inserting ${allAnalysisItems.length} analysis items...`);
  await db.insert(analysisItems).values(allAnalysisItems);

  console.log("✅ Seed completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
