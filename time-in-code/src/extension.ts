import * as vscode from "vscode";
import { ApiClient, API_ENDPOINT } from "./api-client";
import { Tracker } from "./tracker";
import { getGitHubId } from "./utils";

let apiClient: ApiClient;
let tracker: Tracker | null = null;
let extensionContext: vscode.ExtensionContext;
const BASE_URL = API_ENDPOINT.replace("/api", "");

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  extensionContext = context;
  console.log("[CodingTime] Activating...");

  // Initialize API client
  apiClient = new ApiClient(context);

  const alreadyConfigured = await apiClient.isConfigured();

  if (!alreadyConfigured) {
    // First run - prompt user to log in
    const choice = await vscode.window.showInformationMessage(
      "Welcome to Time in Code! Log in with GitHub to start tracking.",
      "Log in with GitHub",
      "Later",
    );

    if (choice === "Log in with GitHub") {
      vscode.commands.executeCommand("timeInCode.login");
    } else {
      vscode.window.showWarningMessage(
        'Tracking is paused. Run "Time in Code: Log in with GitHub" when ready.',
      );
    }
  } else {
    // Already configured - check if we have githubId
    const githubId = await getGitHubId(context);

    if (githubId) {
      await apiClient.initialize();
      await startTracker();
    } else {
      vscode.window
        .showInformationMessage(
          "Please log in again to complete setup.",
          "Log in",
        )
        .then((selection) => {
          if (selection === "Log in") {
            vscode.commands.executeCommand("timeInCode.login");
          }
        });
    }
  }

  // URI handler for GitHub OAuth callback
  context.subscriptions.push(
    vscode.window.registerUriHandler({
      async handleUri(uri: vscode.Uri) {
        const params = new URLSearchParams(uri.query);
        const token = params.get("token");
        const githubId = params.get("githubId");

        if (token && githubId) {
          await context.secrets.store("coding_time_tracker_user_token", token);
          await context.globalState.update("github_id", githubId);

          vscode.window.showInformationMessage(
            "Successfully logged in with GitHub!",
          );

          // Start tracking immediately
          await apiClient.initialize();
          await startTracker();
        }
      },
    }),
  );

  // Register Commands
  context.subscriptions.push(
    vscode.commands.registerCommand("timeInCode.login", async () => {
      await vscode.env.openExternal(
        vscode.Uri.parse(`${BASE_URL}/api/auth/github`),
      );
    }),

    vscode.commands.registerCommand("coding-time-tracker.showStats", showStats),

    vscode.commands.registerCommand("coding-time-tracker.logout", logout),

    vscode.commands.registerCommand(
      "coding-time-tracker.showInfo",
      showUserInfo,
    ),
  );

  // Register cleanup
  context.subscriptions.push({
    dispose: async () => {
      if (tracker) {
        await tracker.stop();
      }
      await apiClient.dispose();
      console.log("[CodingTime] Fully disposed.");
    },
  });

  console.log("[CodingTime]: Activated.");
}

export function deactivate() {
  console.log("[CodingTime]: Extension deactivated.");
}

// Internal Functions

async function startTracker(): Promise<void> {
  const githubId = await getGitHubId(extensionContext);

  if (!githubId) {
    vscode.window
      .showWarningMessage(
        "Please log in with GitHub to start tracking.",
        "Log in",
      )
      .then((selection) => {
        if (selection === "Log in") {
          vscode.commands.executeCommand("timeInCode.login");
        }
      });
    return;
  }

  // No longer passes githubId to tracker
  tracker = new Tracker(apiClient);
  tracker.start();
  console.log("[CodingTime]: Tracker is running.");
}

async function showStats(): Promise<void> {
  if (!tracker) {
    vscode.window.showWarningMessage("Tracker is not running. Log in first.");
    return;
  }

  const githubId = await getGitHubId(extensionContext);

  if (!githubId) {
    vscode.window.showWarningMessage("Please log in with GitHub first.");
    return;
  }

  // Use githubId in URL
  const statsUrl = `${API_ENDPOINT.slice(0, -4)}/dashboard/${githubId}`;
  vscode.window.showInformationMessage("Opening your coding dashboard...");
  vscode.env.openExternal(vscode.Uri.parse(statsUrl));
}

async function logout(): Promise<void> {
  await extensionContext.secrets.delete("coding_time_tracker_user_token");
  await extensionContext.globalState.update("github_id", undefined);

  if (tracker) {
    await tracker.stop();
    tracker = null;
  }

  vscode.window.showInformationMessage("Logged out successfully.");
}

async function showUserInfo(): Promise<void> {
  const githubId = await getGitHubId(extensionContext);
  const token = await apiClient.getUserToken();

  if (!githubId || !token) {
    vscode.window.showWarningMessage(
      'Not logged in. Run "Log in with GitHub".',
    );
    return;
  }

  vscode.window.showInformationMessage(
    `GitHub ID: ${githubId}\nToken: ${token.substring(0, 12)}...`,
  );
}
