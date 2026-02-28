import Link from "next/link";
import CodeBlock from "@/components/docs/code-block";
import { Check } from "lucide-react";

export default function QuickStart() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
          ~2 min
        </span>
        Quick Start Guide
      </div>

      <h1>Quick Start</h1>
      <p>Get from zero to tracking in 2 minutes. GitHub account required.</p>

      {/* Step 1 */}
      <div className="flex gap-4 mt-10">
        <div className="step-number">1</div>
        <div className="flex-1">
          <h2 className="mt-0">Install the Extension</h2>
          <p>
            Download the <code>.vsix</code> file from{" "}
            <a
              href="https://github.com/dipishBisht/Time-In-Code/releases"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Releases
            </a>
            , then install via terminal:
          </p>
          <CodeBlock
            language="bash"
            title="Terminal"
            code={`code --install-extension time-in-code-0.2.0.vsix`}
          />
          <p>Restart VS Code after installation.</p>
          <div className="flex items-center gap-2 text-sm text-primary mt-2">
            <Check className="h-4 w-4" />
            <span>Extension installed</span>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex gap-4 mt-10">
        <div className="step-number">2</div>
        <div className="flex-1">
          <h2 className="mt-0">Log in with GitHub</h2>
          <ol>
            <li>
              Press <code>Ctrl+Shift+P</code> (Windows/Linux) or{" "}
              <code>Cmd+Shift+P</code> (Mac)
            </li>
            <li>
              Type:{" "}
              <strong>&quot;Time in Code: Log in with GitHub&quot;</strong>
            </li>
            <li>Your browser will open to GitHub OAuth</li>
            <li>Click &quot;Authorize&quot;</li>
            <li>You&apos;ll be redirected back to VS Code automatically</li>
          </ol>
          <div className="mt-4 p-4 rounded-lg border bg-primary/5">
            <p className="text-sm font-medium mb-2">🔐 What We Access</p>
            <p className="text-sm text-muted-foreground">
              We only request <code>read:user</code> scope: your GitHub ID,
              username, and avatar. We cannot access your code or repositories.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary mt-2">
            <Check className="h-4 w-4" />
            <span>Logged in with GitHub</span>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex gap-4 mt-10">
        <div className="step-number">3</div>
        <div className="flex-1">
          <h2 className="mt-0">Start Coding</h2>
          <p>
            Open any file and start typing. The extension tracks automatically —
            no action needed!
          </p>
          <div className="flex items-center gap-2 text-sm text-primary mt-2">
            <Check className="h-4 w-4" />
            <span>Tracking active</span>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="flex gap-4 mt-10">
        <div className="step-number">4</div>
        <div className="flex-1">
          <h2 className="mt-0">View Your Stats</h2>
          <ol>
            <li>
              Press <code>Ctrl+Shift+P</code> again
            </li>
            <li>
              Type: <strong>&quot;Time in Code: Show Dashboard&quot;</strong>
            </li>
            <li>Your browser opens with your personalized dashboard</li>
          </ol>
          <CodeBlock
            language="text"
            title="Dashboard URL Format"
            code="https://time-in-code.vercel.app/dashboard/YOUR_GITHUB_ID"
          />
          <p>
            Your dashboard URL uses your GitHub ID (not username). Bookmark it
            for quick access!
          </p>
        </div>
      </div>

      {/* Next steps */}
      <div className="mt-12 p-6 rounded-xl border bg-muted/30">
        <h3>What&apos;s Next?</h3>
        <ul className="space-y-2 mt-3">
          <li>
            <Link
              href="/docs/api-reference"
              className="text-primary hover:underline"
            >
              View API Reference
            </Link>
          </li>
          <li>
            <Link
              href="/docs/embedding"
              className="text-primary hover:underline"
            >
              Embed stats in your portfolio
            </Link>
          </li>
          <li>
            <Link
              href="/docs/troubleshooting"
              className="text-primary hover:underline"
            >
              Troubleshooting
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
