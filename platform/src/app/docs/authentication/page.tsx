import CodeBlock from "@/components/docs/code-block";

export default function Authentication() {
  return (
    <div>
      <h1>Authentication</h1>
      <p>How tokens work and how to manage your API access.</p>

      <h2>How It Works</h2>
      <p>
        Coding Time Tracker uses <strong>bearer tokens</strong> for
        authentication. Each token is unique to your user ID and is used to
        securely submit tracking data.
      </p>

      <h2>Generate a Token</h2>
      <ol>
        <li>Open VS Code</li>
        <li>
          Press <code>Ctrl+Shift+P</code> (or <code>Cmd+Shift+P</code> on Mac)
        </li>
        <li>
          Type: <strong>&quot;Coding Time: Configure API&quot;</strong>
        </li>
        <li>
          Click <strong>&quot;Generate New Token&quot;</strong>
        </li>
      </ol>

      <h2>Using Your Token</h2>
      <p>
        The token is automatically stored in your VS Code settings. If you need
        to use the API directly, include it in the <code>Authorization</code>{" "}
        header:
      </p>

      <CodeBlock
        title="Authorization Header"
        code={`Authorization: Bearer YOUR_TOKEN`}
      />

      <h2>Token Security</h2>
      <ul>
        <li>Never share your token publicly</li>
        <li>Don&apos;t commit tokens to version control</li>
        <li>Regenerate your token if you suspect it&apos;s compromised</li>
        <li>Each token is bound to a single user ID</li>
      </ul>

      <h2>Regenerating a Token</h2>
      <p>
        Run the <code>&quot;Coding Time: Configure API&quot;</code> command
        again and select <strong>&quot;Generate New Token&quot;</strong>. This
        will invalidate the old token.
      </p>
    </div>
  );
}
