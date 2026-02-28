import * as vscode from "vscode";
import { IDayData } from "./types";
import { getCurrentDate, getCurrentLanguage } from "./utils";
import { ApiClient } from "./api-client";

const IDLE_TIMEOUT_MS = 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 1 * 1000;
const SYNC_INTERVAL_MS = 20 * 60 * 1000;

export class Tracker {
  private readonly apiClient: ApiClient;

  private isTracking = false;
  private sessionStartTime: number | null = null;
  private lastActivityTime = 0;
  private currentLanguage = "unknown";
  private currentDate: string;
  private todayData: IDayData;

  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private disposables: vscode.Disposable[] = [];

  constructor(apiClient: ApiClient) {
    // No longer takes githubId - backend derives it from token
    this.apiClient = apiClient;
    this.currentDate = getCurrentDate();
    this.todayData = this.emptyDayData();
  }

  start(): void {
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(
        this.onDocumentChange.bind(this),
      ),
      vscode.window.onDidChangeActiveTextEditor(this.onEditorChange.bind(this)),
    );

    this.heartbeatTimer = setInterval(
      this.onHeartbeat.bind(this),
      HEARTBEAT_INTERVAL_MS,
    );

    this.syncTimer = setInterval(this.onSyncTick.bind(this), SYNC_INTERVAL_MS);

    console.log("[Tracker]: Started.");
  }

  async stop(): Promise<void> {
    this.clearTimers();
    this.flushCurrentSession();
    await this.syncToApi();

    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];

    console.log("[Tracker]: Stopped.");
  }

  private onDocumentChange(event: vscode.TextDocumentChangeEvent): void {
    if (event.document.uri.scheme !== "file") {
      return;
    }

    if (event.contentChanges.length === 0) {
      return;
    }

    this.recordActivity();
  }

  private onEditorChange(editor: vscode.TextEditor | undefined): void {
    if (!editor) {
      return;
    }

    if (editor.document.uri.scheme !== "file") {
      return;
    }

    this.recordActivity();
  }

  private recordActivity(): void {
    this.lastActivityTime = Date.now();
    this.currentLanguage = getCurrentLanguage();

    if (!this.isTracking) {
      this.sessionStartTime = Date.now();
      this.isTracking = true;
      console.log(
        `[Tracker]: Session started. Language: ${this.currentLanguage}`,
      );
    }
  }

  private onHeartbeat(): void {
    if (!this.isTracking) {
      return;
    }

    const idleMs = Date.now() - this.lastActivityTime;

    if (idleMs >= IDLE_TIMEOUT_MS) {
      console.log("[Tracker]: Idle timeout reached. Flushing session.");
      this.flushCurrentSession();
    }
  }

  private flushCurrentSession(): void {
    if (!this.isTracking || !this.sessionStartTime) {
      return;
    }

    const creditUpTo = this.lastActivityTime;
    const durationMs = creditUpTo - this.sessionStartTime;
    const durationSeconds = Math.floor(durationMs / 1000);

    this.isTracking = false;
    this.sessionStartTime = null;

    if (durationSeconds <= 0) {
      return;
    }

    this.checkDateRollover();

    this.todayData.totalSeconds += durationSeconds;
    this.todayData.languages[this.currentLanguage] =
      (this.todayData.languages[this.currentLanguage] || 0) + durationSeconds;

    console.log(
      `[Tracker]: Flushed ${durationSeconds}s of ${this.currentLanguage}. ` +
        `Day total: ${this.todayData.totalSeconds}s`,
    );
  }

  private async onSyncTick(): Promise<void> {
    this.flushCurrentSession();
    await this.syncToApi();
  }

  private async syncToApi(): Promise<void> {
    if (this.todayData.totalSeconds === 0) {
      return;
    }

    console.log(`[Tracker]: Syncing ${this.todayData.totalSeconds}s...`);

    // No longer sends githubId
    const success = await this.apiClient.writeDayData(this.todayData);

    if (success) {
      this.todayData = this.emptyDayData();
      console.log("[Tracker]: Sync OK. Accumulator reset.");
    } else {
      console.log(
        "[Tracker]: Sync failed. Accumulator preserved for next tick.",
      );
    }
  }

  private checkDateRollover(): void {
    const today = getCurrentDate();

    if (today === this.currentDate) {
      return;
    }

    console.log(`[Tracker]: Date rollover: ${this.currentDate} → ${today}`);

    this.apiClient.writeDayData(this.todayData);

    this.currentDate = today;
    this.todayData = this.emptyDayData();
  }

  private emptyDayData(): IDayData {
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
