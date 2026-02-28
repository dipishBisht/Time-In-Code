import CodeBlock from "@/components/docs/code-block";
import Link from "next/link";

export default function Troubleshooting() {
  return (
    <div>
      <h1>Troubleshooting</h1>
      <p>Common issues and how to fix them.</p>

      <h2>Login with GitHub not working</h2>
      <ul>
        <li>
          Make sure your browser allows redirects to <code>vscode://</code> URLs
        </li>
        <li>Check that you authorized the application on GitHub</li>
        <li>Try closing and reopening VS Code, then log in again</li>
        <li>Check the Debug Console in VS Code for error messages</li>
      </ul>

      <div className="mt-4 p-4 rounded-lg border bg-muted/30">
        <p className="text-sm font-medium mb-2">Debug Console</p>
        <p className="text-sm text-muted-foreground">
          View → Debug Console (or Ctrl+Shift+Y) to see detailed login flow logs
        </p>
      </div>

      <h2>Extension not tracking time</h2>
      <ul>
        <li>
          Verify you&apos;re logged in:{" "}
          <code>&quot;Time in Code: Show Account Info&quot;</code>
        </li>
        <li>Ensure you have an internet connection (for syncing data)</li>
        <li>Check that you&apos;re editing files with a recognized language</li>
        <li>Try restarting VS Code</li>
      </ul>

      <h2>Dashboard shows no data</h2>
      <ul>
        <li>Data syncs every 20 minutes — wait a moment and refresh</li>
        <li>Verify you&apos;re using the correct GitHub ID in the URL</li>
        <li>
          Check that tracking is active:{" "}
          <code>&quot;Show Account Info&quot;</code>
        </li>
        <li>
          Ensure you&apos;ve been coding for at least a few minutes after login
        </li>
      </ul>

      <h2>&quot;Unauthorized&quot; error (401)</h2>
      <ul>
        <li>Log out and log in again to refresh your token</li>
        <li>
          Run: <code>&quot;Time in Code: Logout&quot;</code>
        </li>
        <li>
          Then: <code>&quot;Time in Code: Log in with GitHub&quot;</code>
        </li>
      </ul>

      <h2>VS Code commands not appearing</h2>
      <p>
        If &quot;Time in Code&quot; commands don&apos;t appear in the command
        palette:
      </p>
      <ol>
        <li>
          Verify the extension is installed:{" "}
          <code>code --list-extensions | grep time-in-code</code>
        </li>
        <li>Try reinstalling:</li>
      </ol>
      <CodeBlock
        language="bash"
        title="Terminal"
        code={`code --uninstall-extension DipishBisht.time-in-code
code --install-extension time-in-code-0.2.0.vsix`}
      />

      <h2>Browser doesn&apos;t redirect back to VS Code</h2>
      <ul>
        <li>
          Some browsers block <code>vscode://</code> protocol handlers
        </li>
        <li>Try a different browser (Chrome/Edge usually work best)</li>
        <li>Manually open VS Code after GitHub authorization</li>
        <li>Check browser console for errors</li>
      </ul>

      <h2>GitHub ID vs Username</h2>
      <p>
        Your dashboard URL uses your <strong>GitHub ID</strong> (numeric), not
        your username:
      </p>
      <ul>
        <li>
          ❌ Wrong: <code>/dashboard/octocat</code>
        </li>
        <li>
          ✅ Correct: <code>/dashboard/12345678</code>
        </li>
      </ul>
      <p>
        Find your ID: <code>&quot;Time in Code: Show Account Info&quot;</code>
      </p>

      <h2>Still stuck?</h2>
      <p>
        Open an issue on{" "}
        <Link
          href="https://github.com/dipishBisht/Time-In-Code/issues"
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>{" "}
        with:
      </p>
      <ul>
        <li>
          VS Code version (<code>Help → About</code>)
        </li>
        <li>Extension version</li>
        <li>Error messages from Debug Console</li>
        <li>Steps to reproduce the issue</li>
      </ul>
    </div>
  );
}
