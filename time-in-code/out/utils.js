"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = getUserId;
exports.getCurrentDate = getCurrentDate;
exports.getCurrentLanguage = getCurrentLanguage;
exports.formatDuration = formatDuration;
const vscode = require("vscode");
const uuid_1 = require("uuid");
/**
 * Get or create a unique user ID
 */
async function getUserId(context) {
    const KEY = 'coding_time_tracker_user_id';
    const existing = context.globalState.get(KEY);
    if (existing) {
        return existing;
    }
    const newId = (0, uuid_1.v4)();
    await context.globalState.update(KEY, newId);
    console.log('[Utils] Generated new user ID:', newId);
    return newId;
}
/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
/**
 * Get language ID from active editor
 */
function getCurrentLanguage() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return "unknown";
    }
    return editor.document.languageId;
}
/**
 * Format seconds to human-readable time ex: 3665 -> "1h 1m 5s"
 */
function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts = [];
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
//# sourceMappingURL=utils.js.map