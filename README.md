# DevRoast 🔥

> Paste your code. Get roasted.

DevRoast is a fullstack web application where you submit code and receive AI-powered feedback, either constructive or brutally sarcastic, depending on your bravery. Every roast is scored and ranked on a public leaderboard of shame.


https://github.com/user-attachments/assets/7edae32b-4a06-4787-90fb-1e958ad76807


Built during the **NLW Operator** event by **Rocketseat**.

## ✨ Features

- **Code Editor** — syntax-highlighted editor with auto language detection for 14+ languages and dual light/dark theme support.
- **Two Review Modes** — *Normal* mode gives professional, constructive feedback; *Roast Mode* unleashes maximum sarcasm.
- **AI Analysis** — powered by Gemini, each submission returns a score (0–10), a verdict, a list of issues with severity levels, and a suggested code fix with a unified diff.
- **Shame Leaderboard** — the worst code on the internet, ranked by score ascending.
- **Dark Mode** — default theme, because developers only code at night.
- **Rate Limiting** — Limited roasts per IP per hour, enforced at the database level.

## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| API | tRPC v11 + TanStack Query v5 |
| AI | Google Gemini Flash via Vercel AI SDK |
| Database | PostgreSQL 16 + Drizzle ORM |
| Syntax Highlighting | Shiki (editor) + highlight.js (language detection) |
| Linting / Formatting | Biome |
| Testing | Playwright (E2E) |
| Package Manager | pnpm |
 
---
 
## 📁 Project Structure
 
```
src/
├── app/                        # Next.js App Router pages and API
│   ├── api/trpc/[trpc]/        # tRPC HTTP handler
│   ├── leaderboard/            # /leaderboard page
│   ├── roast/[id]/             # /roast/:id result page
│   └── page.tsx                # Home page
├── components/
│   ├── home/                   # Home page components (editor, actions bar, leaderboard preview)
│   ├── layout/                 # Navbar
│   ├── leaderboard/            # Full leaderboard components
│   ├── roast/                  # Roast result components
│   └── ui/                     # Generic UI primitives (Button, Badge, ScoreRing, etc.)
├── server/
│   ├── index.ts                # tRPC init and context
│   ├── router.ts               # All tRPC procedures
│   ├── analysis.ts             # Gemini AI integration and response parsing
│   └── utils/diff.ts           # Unified diff generation
├── trpc/                       # tRPC client, provider, and server utilities
├── db/
│   ├── schema.ts               # Drizzle schema (roasts, analysis_items)
│   └── index.ts                # Database connection
└── lib/
    ├── diff.ts                 # Shared diff parsing utility (client + server)
    └── shiki.ts                # Shiki highlighter singleton
```
 
---
 
## 🚀 Getting Started

 
### Prerequisites
 
- Node.js 20+
- pnpm
- Docker (for PostgreSQL)
 
### 1. Clone and install
 
```bash
git clone https://github.com/tvc95/devroast.git
cd devroast
pnpm install
```

 
### 2. Configure environment variables
 
Create a `.env.local` file in the project root:
 
```env
DATABASE_URL=your_postgresql_database_url_here
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```
 
To get a Gemini API key, visit [Google AI Studio](https://aistudio.google.com/app/apikey).
 
 
### 3. Start the database
 
```bash
docker compose up -d
```
 
### 4. Run migrations
 
```bash
pnpm db:migrate
```
 
### 5. (Optional) Seed with sample data
 
```bash
pnpm db:seed
```
 
This inserts 100 fake roasts with randomized scores and analysis items, useful for testing the leaderboard.

 
### 6. Start the development server
 
```bash
pnpm dev
```
 
Open [http://localhost:3000](http://localhost:3000) to view the app.

---
 
## Available Scripts
 
| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Run Biome formatter (writes changes) |
| `pnpm db:generate` | Generate a new Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations to the database |
| `pnpm db:push` | Push schema directly to the database (skips migration files) |
| `pnpm db:studio` | Open Drizzle Studio (visual database browser) |
| `pnpm db:seed` | Seed the database with fake development data |

---
 
## Contributing
 
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Follow the code conventions enforced by Biome: `pnpm lint`
4. Before implementing a significant feature, create a spec file in `specs/` following the format in `specs/AGENTS.md`
5. Submit a pull request
 
---
 
## 📄 License

This project was developed by [Thiago Viana](https://www.linkedin.com/in/thiagovcarvalho/) and is under the [MIT](https://choosealicense.com/licenses/mit/) license.

MIT © 2026 — built as a portfolio project.

### Contact me

<p align="left">
	<a href="https://www.linkedin.com/in/thiagovcarvalho/"><img src="https://img.shields.io/static/v1?label=linkedin&message=thiagovcarvalho&color=blue&style=flat-square&logo=linkedin" /></a>
	<a href="https://github.com/tvc95/"><img src="https://img.shields.io/static/v1?label=github&message=tvc95&color=blueviolet&style=flat-square&logo=github" /></a>
</p>
