import { FooterStats } from "@/components/home/footer-stats";
import { FooterStatsContent } from "@/components/home/footer-stats-content";
import { LeaderboardPreview } from "@/components/home/leaderboard-preview-client";
import { HomeInteractive } from "@/components/home/home-interactive";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col items-center bg-[var(--bg-page)] px-10 pt-8">
      <div className="flex w-full max-w-[960px] flex-col items-center gap-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="flex items-center gap-3 font-mono text-[36px] font-bold text-[var(--text-primary)]">
            <span className="text-[var(--accent-green)]">$</span>
            paste your code. get roasted.
          </h1>
          <p className="font-mono text-[14px] text-[var(--text-secondary)]">
            {`//`} drop your code below and we&apos;ll rate it — brutally honest
            or full roast mode
          </p>
        </div>

        {/* Code Input + Actions Bar */}
        <HomeInteractive />

        {/* Footer Stats - animated with NumberFlow */}
        <FooterStats>
          <FooterStatsContent />
        </FooterStats>

        {/* Spacer */}
        <div className="h-10" />

        {/* Leaderboard Preview */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-mono text-[14px] font-bold text-[var(--text-primary)]">
              <span className="text-[var(--accent-green)]">{`//`}</span>
              shame_leaderboard
            </h2>
            <span className="font-mono text-[12px] text-[var(--text-secondary)]">
              $ view_all &gt;&gt;
            </span>
          </div>
          <p className="font-mono text-[13px] text-[var(--text-tertiary)]">
            {`//`} the worst code on the internet, ranked by shame
          </p>
          <LeaderboardPreview />
        </div>

        {/* Bottom Spacer */}
        <div className="h-10" />
      </div>
    </main>
  );
}
