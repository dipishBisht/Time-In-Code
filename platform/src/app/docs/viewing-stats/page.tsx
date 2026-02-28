import Link from "next/link";

export default function ViewingStats() {
  return (
    <div>
      <h1>Viewing Your Stats</h1>
      <p>Access your coding activity data anytime, anywhere.</p>

      <h2>1. Quick View in VS Code</h2>
      <ol>
        <li>
          Press <code>Ctrl+Shift+P</code> (or <code>Cmd+Shift+P</code> on Mac)
        </li>
        <li>
          Type: <strong>&quot;Time in Code: Show Dashboard&quot;</strong>
        </li>
        <li>Your browser opens with your personalized dashboard</li>
      </ol>

      <h2>2. Web Dashboard</h2>
      <p>Visit your dashboard directly by navigating to:</p>
      <div className="my-4 p-4 rounded-lg border bg-muted/30">
        <code className="text-sm">
          https://time-in-code.vercel.app/dashboard/YOUR_GITHUB_ID
        </code>
      </div>

      <h3>Finding Your GitHub ID</h3>
      <p>Your GitHub ID is a numeric identifier (not your username):</p>
      <ol>
        <li>
          Press <code>Ctrl+Shift+P</code>
        </li>
        <li>
          Type: <strong>&quot;Time in Code: Show Account Info&quot;</strong>
        </li>
        <li>Copy the GitHub ID shown</li>
      </ol>

      <div className="mt-6 p-4 rounded-lg border bg-primary/5">
        <p className="text-sm font-medium mb-2">💡 Bookmark Your Dashboard</p>
        <p className="text-sm text-muted-foreground">
          Your dashboard URL never changes. Bookmark it for quick access or add
          it to your browser&apos;s favorites.
        </p>
      </div>

      <h2>Dashboard Features</h2>
      <ul>
        <li>
          <strong>Total hours</strong> — Cumulative coding time
        </li>
        <li>
          <strong>Daily trend</strong> — Line chart of coding time over 30 days
        </li>
        <li>
          <strong>Language breakdown</strong> — Pie chart of time per language
        </li>
        <li>
          <strong>Day of week pattern</strong> — See which days you code most
        </li>
        <li>
          <strong>Current streak</strong> — Consecutive days of coding
        </li>
        <li>
          <strong>Recent activity</strong> — Table of last 7 days
        </li>
        <li>
          <strong>Milestones</strong> — Track progress toward goals
        </li>
      </ul>

      <h2>Sharing Your Dashboard</h2>
      <p>Your dashboard URL is public. You can share it on:</p>
      <ul>
        <li>Your portfolio website</li>
        <li>LinkedIn profile</li>
        <li>GitHub README</li>
        <li>Resume or CV</li>
      </ul>

      <p>
        <Link href="/docs/embedding" className="text-primary hover:underline">
          Learn how to embed stats in your portfolio →
        </Link>
      </p>
    </div>
  );
}
