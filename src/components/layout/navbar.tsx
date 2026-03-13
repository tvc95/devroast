import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-page)] px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold text-[var(--accent-green)]">
          &gt;
        </span>
        <span className="font-mono text-lg font-medium text-[var(--text-primary)]">
          devroast
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link
          href="/leaderboard"
          className="font-mono text-[13px] text-[var(--text-secondary)]"
        >
          leaderboard
        </Link>
      </div>
    </header>
  );
}
