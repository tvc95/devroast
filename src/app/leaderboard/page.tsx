import type { Metadata } from "next";
import { CodeBlock } from "./code-block";

const leaderboardEntries = [
  {
    rank: 1,
    author: "quantum_dev",
    date: "2 hours ago",
    language: "JavaScript",
    score: "2.1",
    code: `function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
    issue: "Using a for loop instead of reduce",
  },
  {
    rank: 2,
    author: "npm_install_god",
    date: "5 hours ago",
    language: "Python",
    score: "3.4",
    code: `def get_user_data(user_id):
    user = db.query("SELECT * FROM users WHERE id = " + user_id)
    return user`,
    issue: "SQL injection vulnerability",
  },
  {
    rank: 3,
    author: "callback_hell",
    date: "1 day ago",
    language: "JavaScript",
    score: "3.8",
    code: `fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    fetch('/api/posts/' + data.id)
      .then(res2 => res2.json())
      .then(posts => {
        // more nesting...
      });
  });`,
    issue: "Callback hell without async/await",
  },
  {
    rank: 4,
    author: "git_push_force",
    date: "2 days ago",
    language: "Bash",
    score: "4.5",
    code: `git add .
git commit -m "fix stuff"
git push origin main --force`,
    issue: "Force pushing to main",
  },
  {
    rank: 5,
    author: "magic_numbers",
    date: "3 days ago",
    language: "Java",
    score: "5.2",
    code: `public double calculatePrice(double base) {
  return base * 1.15 * 1.08 * 0.95 * 1.02;
}`,
    issue: "Magic numbers without explanation",
  },
];

export default function ShameLeaderboardPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg-page)] px-20 py-10">
      <section className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl font-bold text-[var(--accent-green)]">
            &gt;
          </span>
          <h1 className="font-mono text-3xl font-bold text-[var(--text-primary)]">
            shame_leaderboard
          </h1>
        </div>

        <p className="font-mono text-sm text-[var(--text-secondary)]">
          // the most roasted code on the internet
        </p>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--text-tertiary)]">
            2,847 submissions
          </span>
          <span className="font-mono text-xs text-[var(--text-tertiary)]">·</span>
          <span className="font-mono text-xs text-[var(--text-tertiary)]">
            avg score: 4.2/10
          </span>
        </div>
      </section>

      <section className="mt-10 flex flex-col gap-5">
        {leaderboardEntries.map((entry) => (
          <div
            key={entry.rank}
            className="flex flex-col rounded-sm border border-[var(--border-primary)] bg-[var(--bg-surface)]"
          >
            <div className="flex h-12 items-center justify-between border-b border-[var(--border-primary)] px-5">
              <div className="flex items-center gap-4">
                <span
                  className={`font-mono text-lg font-bold ${
                    entry.rank <= 3
                      ? "text-[var(--accent-red)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  #{entry.rank}
                </span>
                <span className="font-mono text-sm text-[var(--text-primary)]">
                  {entry.author}
                </span>
                <span className="font-mono text-xs text-[var(--text-tertiary)]">
                  {entry.date}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-sm bg-[var(--bg-input)] px-2 py-1 font-mono text-xs text-[var(--text-secondary)]">
                  {entry.language}
                </span>
                <span className="font-mono text-xs text-[var(--text-tertiary)]">
                  score:{" "}
                  <span className="text-[var(--accent-red)]">{entry.score}</span>
                  /10
                </span>
              </div>
            </div>

            <CodeBlock code={entry.code} language={entry.language} />

            <div className="border-t border-[var(--border-primary)] bg-[var(--bg-input)] px-5 py-2">
              <span className="font-mono text-xs text-[var(--accent-amber)]">
                roast: {entry.issue}
              </span>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
