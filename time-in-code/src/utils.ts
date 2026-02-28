import * as vscode from "vscode";

/**
 * Get GitHub ID from stored state
 */
export async function getGitHubId(
  context: vscode.ExtensionContext,
): Promise<string | null> {
  return context.globalState.get<string>("github_id") || null;
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get language ID from active editor
 */
export function getCurrentLanguage(): string {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return "unknown";
  }

  return editor.document.languageId;
}

/**
 * Format seconds to human-readable time ex: 3665 -> "1h 1m 5s"
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hrs > 0) {
    parts.push(`${hrs}h`);
  }
  if (mins > 0) {
    parts.push(`${mins}m`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(" ");
}
