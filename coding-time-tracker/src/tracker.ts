import * as vscode from "vscode";
import { IDayData } from "./types.js";
import { getCurrentDate, getCurrentLanguage } from "./utils.js";
import { FirebaseManager } from "./firebase.js";

/**
 * CONSTANTS
 */

/** How long (ms) of silence before we consider user idle */
const IDLE_TIMEOUT_MS = 60 * 1000; // 60 seconds

/** How often (ms) the heartbeat checks for idle */
const HEARTBEAT_INTERVAL_MS = 1000; // 1 second

/** How often (ms) we sync accumulated data to Firebase */
const SYNC_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * TRACKER CLASS
 */

export class Tracker {
  // ── Dependencies ──────────────────────────
  private firebaseManager: FirebaseManager;
  private userId: string;

  // ── State: Is the user currently active? ──
  private isTracking = false;

  // ── State: When did the current session start? ──
  // Null when not tracking.
  private sessionStartTime: number | null = null;

  // ── State: When was the last activity detected? ──
  // This is NOT the same as sessionStartTime.
  // sessionStartTime = when tracking began.
  // lastActivityTime = when the user last did something.
  // We flush time up to lastActivityTime, not Date.now().
  private lastActivityTime: number = 0;

  // ── State: What language is the user currently coding in? ──
  // Captured at each activity event so we know which language
  // to credit when we flush a chunk.
  private currentLanguage: string = "unknown";

  // ── State: What date are we tracking? ──
  // If this changes (midnight rollover), we flush and reset.
  private currentDate: string = getCurrentDate();

  // ── State: Today's accumulated data ──
  // This is what gets written to Firebase on sync.
  // It resets after each successful sync.
  private todayData: IDayData = this.createEmptyDayData();

  // ── Timers ────────────────────────────────
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private syncTimer: NodeJS.Timeout | null = null;

  // ── Event Disposables ────────────────────
  private disposables: vscode.Disposable[] = [];

  constructor(firebaseManager: FirebaseManager, userId: string) {
    this.firebaseManager = firebaseManager;
    this.userId = userId;
  }

  // ─────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────

  /**
   * Start the tracker. Call this once from extension.ts activate().
   */
  start(): void {
    console.log("[Tracker] Starting...");

    // Listen to VS Code events
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(
        this.onDocumentChange.bind(this),
      ),
      vscode.window.onDidChangeActiveTextEditor(this.onEditorChange.bind(this)),
    );

    // Start the heartbeat (checks for idle every second)
    this.heartbeatTimer = setInterval(
      this.onHeartbeat.bind(this),
      HEARTBEAT_INTERVAL_MS,
    );

    // Start the sync timer (writes to Firebase every 10 min)
    this.syncTimer = setInterval(this.onSyncTick.bind(this), SYNC_INTERVAL_MS);

    console.log("[Tracker] Started. Listening for activity.");
  }

  /**
   * Stop the tracker cleanly. Call this on deactivate().
   * CRITICAL: Flushes any in-progress session before stopping.
   */
  async stop(): Promise<void> {
    console.log("[Tracker] Stopping...");

    // Clear timers first so nothing fires while we flush
    this.clearTimers();

    // Flush any active session so we don't lose time
    this.flushCurrentSession();

    // Do a final sync so nothing is lost
    await this.syncToFirebase();

    // Dispose of event listeners
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];

    console.log("[Tracker] Stopped.");
  }

  // ─────────────────────────────────────────────
  // EVENT HANDLERS
  // ─────────────────────────────────────────────

  /**
   * Fires every time the user types or edits in any document.
   * This is our primary activity signal.
   */
  private onDocumentChange(event: vscode.TextDocumentChangeEvent): void {
    // Ignore non-file documents (like the terminal, output panel, etc.)
    if (event.document.uri.scheme !== "file") {
      return;
    }

    // Ignore documents with no actual changes (e.g. formatting-only events)
    if (event.contentChanges.length === 0) {
      return;
    }

    this.recordActivity();
  }

  /**
   * Fires when the user switches between editor tabs.
   * We treat this as activity too — the user is engaged.
   */
  private onEditorChange(editor: vscode.TextEditor | undefined): void {
    if (!editor) {
      return; // All editors closed — not active
    }

    // Only track file editors, not terminal/output
    if (editor.document.uri.scheme !== "file") {
      return;
    }

    this.recordActivity();
  }

  // ─────────────────────────────────────────────
  // CORE TRACKING LOGIC
  // ─────────────────────────────────────────────

  /**
   * CRITICAL: Called on every detected activity.
   * This is the single entry point for "user is doing something".
   */
  private recordActivity(): void {
    this.lastActivityTime = Date.now();
    this.currentLanguage = getCurrentLanguage();

    if (!this.isTracking) {
      // User was idle, now they're active again. Start a new session.
      this.sessionStartTime = Date.now();
      this.isTracking = true;
      console.log(
        `[Tracker] Tracking started. Language: ${this.currentLanguage}`,
      );
    }
  }

  /**
   * Fires every second. Checks if user has been idle too long.
   */
  private onHeartbeat(): void {
    if (!this.isTracking) {
      return; // Nothing to check — we're already idle
    }

    const idleDuration = Date.now() - this.lastActivityTime;

    if (idleDuration >= IDLE_TIMEOUT_MS) {
      // User has been idle for 60+ seconds
      console.log("[Tracker] Idle detected. Flushing session.");
      this.flushCurrentSession();
    }
  }

  /**
   * Flush the current active session into todayData.
   *
   * This calculates how long the user was active and adds it
   * to the correct language bucket in todayData.
   *
   * Time is credited up to lastActivityTime, NOT Date.now().
   * This avoids crediting idle time.
   */
  private flushCurrentSession(): void {
    if (!this.isTracking || !this.sessionStartTime) {
      return; // Nothing to flush
    }

    // Credit time up to lastActivityTime (not now — that would include idle time)
    const activeMs = this.lastActivityTime - this.sessionStartTime;
    const activeSeconds = Math.floor(activeMs / 1000);

    if (activeSeconds <= 0) {
      // Edge case: activity event fired but no real time passed
      this.isTracking = false;
      this.sessionStartTime = null;
      return;
    }

    // Check for midnight rollover BEFORE accumulating
    this.checkDateRollover();

    // Accumulate into todayData
    this.todayData.totalSeconds += activeSeconds;
    this.todayData.languages[this.currentLanguage] =
      (this.todayData.languages[this.currentLanguage] || 0) + activeSeconds;

    console.log(
      `[Tracker] Flushed ${activeSeconds}s of ${this.currentLanguage}. ` +
        `Today total: ${this.todayData.totalSeconds}s`,
    );

    // Reset session state
    this.isTracking = false;
    this.sessionStartTime = null;
  }

  /**
   * Fires every 10 minutes. Writes accumulated data to Firebase.
   */
  private async onSyncTick(): Promise<void> {
    // If user is actively coding, flush their current session first
    // so we don't miss time that's accumulated but not yet flushed.
    this.flushCurrentSession();

    // Now sync whatever we have
    await this.syncToFirebase();
  }

  /**
   * Write todayData to Firebase, then reset the local accumulator.
   */
  private async syncToFirebase(): Promise<void> {
    // Nothing to sync if we have zero seconds
    if (this.todayData.totalSeconds === 0) {
      console.log("[Tracker] Nothing to sync.");
      return;
    }

    console.log(
      `[Tracker] Syncing ${this.todayData.totalSeconds}s to Firebase...`,
    );

    const success = await this.firebaseManager.writeDayData(
      this.userId,
      this.todayData,
    );

    if (success) {
      // Reset accumulator after successful write
      // Only reset on success. If write fails, we keep
      // the data and it will be included in the next sync attempt.
      this.todayData = this.createEmptyDayData();
      console.log("[Tracker] Sync successful. Accumulator reset.");
    } else {
      console.log("[Tracker] Sync failed. Data preserved for next attempt.");
    }
  }

  // ─────────────────────────────────────────────
  // MIDNIGHT ROLLOVER
  // ─────────────────────────────────────────────

  /**
   * Detects if the date has changed (user coded past midnight).
   * If so, syncs current day's data immediately and resets for the new day.
   */
  private checkDateRollover(): void {
    const today = getCurrentDate();

    if (today !== this.currentDate) {
      console.log(
        `[Tracker] Date rollover detected: ${this.currentDate} → ${today}`,
      );

      // Sync the OLD day's data immediately (don't wait for next sync tick)
      // We do this synchronously here — the actual Firebase write is fire-and-forget
      // because we can't await in this context cleanly.
      // The data is safe because writeDayData queues on failure.
      this.firebaseManager.writeDayData(this.userId, this.todayData);

      // Reset for the new day
      this.currentDate = today;
      this.todayData = this.createEmptyDayData();

      console.log(`[Tracker] New day started: ${today}`);
    }
  }

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  private createEmptyDayData(): IDayData {
    return {
      date: this.currentDate,
      totalSeconds: 0,
      languages: {},
    };
  }

  private clearTimers(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
}
