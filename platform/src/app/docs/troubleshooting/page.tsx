import CodeBlock from "@/components/docs/code-block";
import Link from "next/link";

export default function Troubleshooting() {
  return (
    <div>
      <h1>Troubleshooting</h1>
      <p>Common issues and how to fix them.</p>

      <h2>Extension not tracking time</h2>
      <ul>
        <li>
          Make sure you&apos;ve generated a token via{" "}
          <code>&quot;Coding Time: Configure API&quot;</code>
        </li>
        <li>Check that the API URL is correct in your VS Code settings</li>
        <li>
          Ensure you have an internet connection — data syncs in the background
        </li>
        <li>Try restarting VS Code</li>
      </ul>

      <h2>Token not working (401 error)</h2>
      <ul>
        <li>
          Your token may have expired. Regenerate it using{" "}
          <code>&quot;Coding Time: Configure API&quot;</code>
        </li>
        <li>Make sure the token matches the user ID</li>
        <li>Check for leading/trailing whitespace when copying the token</li>
      </ul>

      <h2>Dashboard shows no data</h2>
      <ul>
        <li>Data syncs every few minutes. Wait a moment and refresh.</li>
        <li>
          Ensure you&apos;ve been coding for at least a few minutes after setup
        </li>
        <li>Verify you&apos;re using the correct User ID in the URL</li>
      </ul>

      <h2>VS Code command not found</h2>
      <p>
        If &quot;Coding Time&quot; commands don&apos;t appear in the command
        palette:
      </p>
      <ol>
        <li>
          Verify the extension is installed: <code>code --list-extensions</code>
        </li>
        <li>Try reinstalling:</li>
      </ol>
      <CodeBlock
        language="bash"
        title="Terminal"
        code={`code --uninstall-extension coding-time-tracker
code --install-extension coding-time-tracker-0.1.0.vsix`}
      />

      <h2>API rate limit exceeded</h2>
      <p>
        If you see <code>429 Too Many Requests</code>, wait a minute and try
        again. Normal extension usage stays well within limits.
      </p>

      <h2>Still stuck?</h2>
      <p>
        Open an issue on{" "}
        <Link
          href="https://github.com"
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>{" "}
        and we&apos;ll help you out.
      </p>
    </div>
  );
}
