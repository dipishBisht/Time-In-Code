import CodeBlock from "@/components/docs/code-block";

export default function Installation() {
  return (
    <div>
      <h1>Installation</h1>
      <p>How to install the Coding Time Tracker VS Code extension.</p>

      <h2>Option A: Download .vsix (Recommended)</h2>
      <ol>
        <li>
          Go to the{" "}
          <a
            href="https://github.com"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Releases page
          </a>
        </li>
        <li>
          Download <code>coding-time-tracker-x.x.x.vsix</code>
        </li>
        <li>Install via terminal:</li>
      </ol>
      <CodeBlock
        language="bash"
        title="Terminal"
        code="code --install-extension coding-time-tracker-0.1.0.vsix"
      />
      <p>Restart VS Code after installation.</p>

      <h2>Option B: VS Code Marketplace</h2>
      <p className="text-muted-foreground italic">
        Coming soon — the extension will be available on the VS Code
        Marketplace.
      </p>

      <h2>Verify Installation</h2>
      <p>
        After installing, press <code>Ctrl+Shift+P</code> and type{" "}
        <strong>&quot;Coding Time&quot;</strong>. You should see available
        commands:
      </p>
      <ul>
        <li>
          <code>Coding Time: Configure API</code>
        </li>
        <li>
          <code>Coding Time: Show Today&apos;s Stats</code>
        </li>
      </ul>

      <h2>System Requirements</h2>
      <ul>
        <li>VS Code 1.80 or later</li>
        <li>Internet connection (for syncing data)</li>
      </ul>
    </div>
  );
}
