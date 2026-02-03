"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const api_client_1 = require("./api-client");
const tracker_1 = require("./tracker");
const utils_1 = require("./utils");
/**
 * MODULE-LEVEL STATE
 * These live for the entire lifetime of the extension.
 */
let apiClient;
let tracker = null;
let extensionContext;
/**
 * ACTIVATION
 */
async function activate(context) {
    extensionContext = context;
    console.log("[CodingTime] Activating...");
    // ── 1. Firebase setup ───────────
    apiClient = new api_client_1.ApiClient(context);
    const alreadyConfigured = await apiClient.isConfigured();
    if (!alreadyConfigured) {
        const choice = await vscode.window.showInformationMessage("Coding Time Tracker will generate a secure token to sync your data.", "Generate Token", "Later");
        if (choice === "Generate Token") {
            await runConfigureFlow();
        }
        else {
            vscode.window.showWarningMessage("Tracking is paused until configured. " +
                'Run "Coding Time: Configure API" from the Command Palette when ready.');
        }
    }
    else {
        await apiClient.initialize();
    }
    // ── 2. Start the tracker, if configured ──
    const ready = await apiClient.initialize();
    if (ready) {
        await startTracker();
    }
    else {
        vscode.window.showInformationMessage('Coding Time is not configured yet. Run "Coding Time: Configure API" to start tracking.');
    }
    // ── 3: Register Commands ─────────────
    context.subscriptions.push(vscode.commands.registerCommand("coding-time-tracker.configure", runConfigureFlow), vscode.commands.registerCommand("coding-time-tracker.showStats", showStats), vscode.commands.registerCommand("coding-time-tracker.showToken", showToken));
    // ── 4: Register cleanup ──────────────
    context.subscriptions.push({
        dispose: async () => {
            if (tracker) {
                await tracker.stop();
            }
            await apiClient.dispose();
            console.log("[CodingTime] Fully disposed.");
        },
    });
    console.log("[CodingTime] Activated.");
}
/**
 * DEACTIVATION
 */
function deactivate() {
    console.log("[CodingTime] Extension deactivated.");
    // Cleanup is handled by the disposable registered above
    // This export exists because VS Code requires it.
}
// INTERNAL FUNCTIONS
/**
 * Create and start a Tracker.
 */
async function startTracker() {
    const userId = await (0, utils_1.getUserId)(extensionContext);
    tracker = new tracker_1.Tracker(apiClient, userId);
    tracker.start();
    console.log("[CodingTime] Tracker is running.");
}
/**
 * Command handler: "Coding Time: Configure API"
 */
async function runConfigureFlow() {
    const choice = await vscode.window.showInformationMessage("Do you already have a token from the website, or should we generate one?", "Generate New Token", "I Have a Token");
    let token;
    if (choice === "I Have a Token") {
        token = await vscode.window.showInputBox({
            prompt: "Paste your token from the website",
            placeHolder: "abc123...",
            password: true,
            ignoreFocusOut: true,
            validateInput: (value) => {
                if (value.length < 16) {
                    return "Token seems too short. Make sure you copied the entire thing.";
                }
                return null;
            },
        });
        if (!token) {
            return;
        }
    }
    const success = await apiClient.configure(token);
    if (success) {
        vscode.window.showInformationMessage("API configured successfully.");
        const userToken = await apiClient.getUserToken();
        if (userToken && !choice) {
            // Only show if we generated it (not if they pasted their own)
            vscode.window.showInformationMessage(`Your token: ${userToken}\n\n` +
                'Save this somewhere safe. You can view it anytime with "Coding Time: Show Token".');
        }
        // Start tracker if not already running
        if (!tracker) {
            await startTracker();
        }
    }
    else {
        vscode.window.showErrorMessage("Configuration failed. Check the Debug Console for details.");
    }
}
/**
 * Command handler: "Coding Time: Show Today's Stats"
 */
async function showStats() {
    if (!tracker) {
        vscode.window.showWarningMessage("Tracker is not running. Configure the API first.");
        return;
    }
    const userId = await (0, utils_1.getUserId)(extensionContext);
    const today = (0, utils_1.getCurrentDate)();
    const token = await apiClient.getUserToken();
    vscode.window.showInformationMessage(`User ID: ${userId}\n` +
        `Today: ${today}\n` +
        `Token: ${token}\n\n` +
        `View your stats at:\n` +
        `${api_client_1.API_ENDPOINT}/stats/${userId}`);
}
/**
 * Command handler: "Coding Time: Show Token"
 */
async function showToken() {
    const token = await apiClient.getUserToken();
    if (!token) {
        vscode.window.showWarningMessage('No token found. Run "Configure API" first.');
        return;
    }
    vscode.window.showInformationMessage(`Your token:\n${token}\n\n` +
        "Use this token on the website to view your stats.");
}
//# sourceMappingURL=extension.js.map