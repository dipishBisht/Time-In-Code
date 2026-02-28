import CodeBlock from "@/components/docs/code-block";
import Link from "next/link";

export default function Installation() {
  return (
    <div>
      <h1>Installation</h1>
      <p>How to install the Time in Code VS Code extension.</p>

      <h2>Option A: Download .vsix (Recommended)</h2>
      <ol>
        <li>
          Go to the{" "}
          <a
            href="https://github.com/dipishBisht/Time-In-Code/releases"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Releases page
          </a>
        </li>
        <li>
          Download <code>time-in-code-x.x.x.vsix</code>
        </li>
        <li>Install via terminal:</li>
      </ol>
      <CodeBlock
        language="bash"
        title="Terminal"
        code="code --install-extension time-in-code-0.2.0.vsix"
      />
      <p>Restart VS Code after installation.</p>

      <h2>Option B: VS Code Marketplace</h2>
      <p className="text-muted-foreground italic">
        Coming soon — the extension will be available on the VS Code
        Marketplace.
      </p>

      <h2>First-Time Setup</h2>
      <p>After installation, VS Code will prompt you to log in with GitHub:</p>
      <ol>
        <li>Click &quot;Log in with GitHub&quot; in the welcome message</li>
        <li>Your browser will open</li>
        <li>Authorize the application on GitHub</li>
        <li>You&apos;ll be redirected back to VS Code</li>
        <li>Start coding — tracking begins automatically!</li>
      </ol>

      <div className="mt-6 p-4 rounded-lg border bg-primary/5">
        <p className="text-sm font-medium mb-2">⚡ Quick Setup</p>
        <p className="text-sm text-muted-foreground">
          The entire setup takes less than 2 minutes. No manual token
          generation, no configuration files — just GitHub OAuth and you&apos;re
          done.
        </p>
      </div>

      <h2>Verify Installation</h2>
      <p>
        After installing, press <code>Ctrl+Shift+P</code> and type{" "}
        <strong>&quot;Time in Code&quot;</strong>. You should see:
      </p>
      <ul>
        <li>
          <code>Time in Code: Log in with GitHub</code>
        </li>
        <li>
          <code>Time in Code: Show Dashboard</code>
        </li>
        <li>
          <code>Time in Code: Show Account Info</code>
        </li>
        <li>
          <code>Time in Code: Logout</code>
        </li>
      </ul>

      <h2>System Requirements</h2>
      <ul>
        <li>VS Code 1.80 or later</li>
        <li>Internet connection (for syncing data and GitHub OAuth)</li>
        <li>GitHub account (free)</li>
      </ul>

      <h2>What&apos;s Next?</h2>
      <p>
        After installation, check out the{" "}
        <Link href="/docs/quick-start" className="text-primary hover:underline">
          Quick Start Guide
        </Link>{" "}
        to start tracking your coding time.
      </p>
    </div>
  );
}
