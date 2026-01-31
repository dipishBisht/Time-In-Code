import * as vscode from 'vscode';
import { FirebaseManager } from './firebase.js';
import { Tracker } from './tracker.js';
import { getUserId } from './utils.js';

// ─────────────────────────────────────────────
// MODULE-LEVEL STATE
// These live for the entire lifetime of the extension.
// ─────────────────────────────────────────────
let firebaseManager: FirebaseManager;
let tracker: Tracker | null = null;
let extensionContext: vscode.ExtensionContext;

// ─────────────────────────────────────────────
// ACTIVATION
// ─────────────────────────────────────────────

export async function activate(context: vscode.ExtensionContext) {
  console.log('[CodingTime] Extension activated.');

  extensionContext = context;

  // ── Step 1: Initialize Firebase ───────────
  firebaseManager = new FirebaseManager(context);
  const isConfigured = await firebaseManager.isConfigured();

  if (!isConfigured) {
    // First run — ask user to configure
    const choice = await vscode.window.showInformationMessage(
      'Coding Time Tracker needs a Firebase service account to sync data.',
      'Configure Now',
      'Later'
    );

    if (choice === 'Configure Now') {
      await runConfigureFlow();
    } else {
      vscode.window.showWarningMessage(
        'Tracking is paused. Run "Coding Time: Configure Firebase" when ready.'
      );
    }
  } else {
    // Already configured — initialize silently
    await firebaseManager.initialize();
  }

  // ── Step 2: Start the Tracker (only if Firebase is ready) ──
  if (await firebaseManager.isConfigured()) {
    await startTracker(context);
  }

  // ── Step 3: Register Commands ─────────────
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'coding-time-tracker.configure',
      () => runConfigureFlow()
    ),
    vscode.commands.registerCommand(
      'coding-time-tracker.showStats',
      () => showStats(context)
    )
  );

  // ── Step 4: Register cleanup ──────────────
  context.subscriptions.push({
    dispose: () => {
      if (tracker) {
        tracker.stop();
      }
      firebaseManager.dispose();
    }
  });
}

// ─────────────────────────────────────────────
// DEACTIVATION
// ─────────────────────────────────────────────

export function deactivate() {
  console.log('[CodingTime] Extension deactivated.');
  // Cleanup is handled by the disposable registered above
}

// ─────────────────────────────────────────────
// INTERNAL FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Initialize and start the tracker.
 */
async function startTracker(context: vscode.ExtensionContext): Promise<void> {
  const userId = await getUserId(context);
  tracker = new Tracker(firebaseManager, userId);
  tracker.start();
  console.log('[CodingTime] Tracker started.');
}

/**
 * Run the Firebase configuration flow.
 * Prompts user for service account JSON, stores it, then starts tracker.
 */
async function runConfigureFlow(): Promise<void> {
  const input = await vscode.window.showInputBox({
    prompt: 'Paste your Firebase service account JSON here',
    placeHolder: '{ "type": "service_account", ... }',
    ignoreFocusOut: true,
    validateInput: (value) => {
      try {
        const parsed = JSON.parse(value);
        if (!parsed.project_id || !parsed.private_key || !parsed.client_email) {
          return 'Missing required fields: project_id, private_key, client_email';
        }
        return null; // Valid
      } catch {
        return 'Invalid JSON. Paste the entire contents of your service account file.';
      }
    }
  });

  if (!input) {
    return; // User cancelled
  }

  const success = await firebaseManager.configure(input);

 if (success) {
    vscode.window.showInformationMessage('✅ Firebase configured. Starting tracker...');
    await startTracker(extensionContext);
  } else {
    vscode.window.showErrorMessage('❌ Firebase configuration failed. Check the Debug Console for details.');
  }
}

/**
 * OPTIONAL: Show today's stats in a simple message box.
 * Useful for debugging during development.
 */
async function showStats(context: vscode.ExtensionContext): Promise<void> {
  vscode.window.showInformationMessage('Stats: check the Debug Console for live tracker output.');
}