import CodeBlock from "@/components/docs/code-block";
import Link from "next/link";

export default function Authentication() {
  return (
    <div>
      <h1>Authentication</h1>
      <p>How to log in with GitHub and manage your API access.</p>

      <h2>How It Works</h2>
      <p>
        Time in Code uses <strong>GitHub OAuth</strong> for authentication. When
        you log in, the extension receives a secure token that&apos;s tied to
        your GitHub account.
      </p>

      <h2>Log in with GitHub</h2>
      <ol>
        <li>Open VS Code</li>
        <li>
          Press <code>Ctrl+Shift+P</code> (or <code>Cmd+Shift+P</code> on Mac)
        </li>
        <li>
          Type: <strong>&quot;Time in Code: Log in with GitHub&quot;</strong>
        </li>
        <li>Your browser will open and redirect to GitHub</li>
        <li>Authorize the application</li>
        <li>You&apos;ll be redirected back to VS Code automatically</li>
      </ol>

      <div className="mt-6 p-4 rounded-lg border bg-primary/5">
        <p className="text-sm font-medium mb-2">✅ First-Time Setup</p>
        <p className="text-sm text-muted-foreground">
          The extension will prompt you to log in with GitHub on first run. Just
          click &quot;Log in with GitHub&quot; and follow the flow.
        </p>
      </div>

      <h2>What Happens During Login</h2>
      <ol>
        <li>Extension opens your browser to GitHub OAuth</li>
        <li>You authorize the app to read your GitHub profile</li>
        <li>GitHub redirects back with a secure code</li>
        <li>
          Our backend exchanges the code for your GitHub ID and generates a
          token
        </li>
        <li>Extension receives both your GitHub ID and token</li>
        <li>Tracking starts automatically</li>
      </ol>

      <h2>Using Your Token</h2>
      <p>
        The token is automatically stored in VS Code&apos;s secure storage. If
        you need to use the API directly, include it in the{" "}
        <code>Authorization</code> header:
      </p>

      <CodeBlock
        title="Authorization Header"
        code={`Authorization: Bearer YOUR_TOKEN`}
      />

      <h2>Your GitHub ID</h2>
      <p>
        Your GitHub ID (not your username) is used as your unique identifier.
        This means:
      </p>
      <ul>
        <li>Same GitHub account = same data across all devices</li>
        <li>
          Your dashboard URL: <code>/dashboard/YOUR_GITHUB_ID</code>
        </li>
        <li>Your stats are tied to your GitHub account permanently</li>
      </ul>

      <h2>View Your Account Info</h2>
      <p>To see your GitHub ID and token:</p>
      <ol>
        <li>
          Press <code>Ctrl+Shift+P</code>
        </li>
        <li>
          Type: <strong>&quot;Time in Code: Show Account Info&quot;</strong>
        </li>
      </ol>

      <h2>Token Security</h2>
      <ul>
        <li>Tokens are stored in VS Code&apos;s encrypted Secrets API</li>
        <li>Never share your token publicly</li>
        <li>Tokens are unique per GitHub account</li>
        <li>
          Logging in again will give you the same token (not generate new)
        </li>
      </ul>

      <h2>Logout</h2>
      <p>To log out and stop tracking:</p>
      <ol>
        <li>
          Press <code>Ctrl+Shift+P</code>
        </li>
        <li>
          Type: <strong>&quot;Time in Code: Logout&quot;</strong>
        </li>
      </ol>
      <p>
        This will remove your token and GitHub ID from local storage. Your data
        remains in the database.
      </p>

      <h2>Privacy</h2>
      <p>
        We only request <code>read:user</code> scope from GitHub, which gives
        us:
      </p>
      <ul>
        <li>Your GitHub ID (numeric)</li>
        <li>Your GitHub username</li>
        <li>Your avatar URL</li>
      </ul>
      <p>
        We <strong>cannot</strong> access your repositories, code, or any other
        private information.
      </p>

      <div className="mt-6 p-4 rounded-lg border bg-muted/30">
        <h3>Need Help?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          If login fails, check{" "}
          <Link
            href="/docs/troubleshooting"
            className="text-primary hover:underline"
          >
            Troubleshooting
          </Link>{" "}
          or open an issue on GitHub.
        </p>
      </div>
    </div>
  );
}
