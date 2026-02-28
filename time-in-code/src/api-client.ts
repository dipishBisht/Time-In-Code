import * as vscode from "vscode";
import { IDayData, IQueuedUpdate } from "./types";
import axios from "axios";

const SECRETS_KEY_USER_TOKEN = "coding_time_tracker_user_token";

export const API_ENDPOINT = "https://time-in-code.vercel.app/api";

export class ApiClient {
  private context: vscode.ExtensionContext;
  private apiEndpoint: string = API_ENDPOINT;
  private userToken: string | null = null;
  private initialized = false;

  private offlineQueue: IQueuedUpdate[] = [];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  /**
   * Initialize by loading stored token
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    this.userToken =
      (await this.context.secrets.get(SECRETS_KEY_USER_TOKEN)) || null;

    if (!this.userToken) {
      console.log("[ApiClient] No user token found. User needs to log in.");
      return false;
    }

    this.initialized = true;
    console.log("[ApiClient]: Initialized successfully.");

    await this.drainOfflineQueue();

    return true;
  }

  /**
   * Check if configured
   */
  async isConfigured(): Promise<boolean> {
    const token = await this.context.secrets.get(SECRETS_KEY_USER_TOKEN);
    return token !== null;
  }

  /**
   * Get the current user token
   */
  async getUserToken(): Promise<string | null> {
    return (await this.context.secrets.get(SECRETS_KEY_USER_TOKEN)) || null;
  }

  /**
   * Post tracking data to API
   * NO LONGER sends githubId - backend derives it from token
   */
  async writeDayData(data: IDayData): Promise<boolean> {
    if (!this.initialized || !this.userToken) {
      console.log("[ApiClient] Not initialized — queueing update.");
      this.enqueue(data);
      return false;
    }

    try {
      const response = await axios.post(
        `${this.apiEndpoint}/track`,
        {
          // Only send date, totalSeconds, languages
          // Backend derives githubId from token
          date: data.date,
          totalSeconds: data.totalSeconds,
          languages: data.languages,
        },
        {
          headers: {
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );

      if (!response.data) {
        throw new Error(
          `API returned ${response.status}: ${response.data?.message || "Unknown error"}`,
        );
      }

      console.log(
        `[ApiClient]: Synced ${data.date}: +${data.totalSeconds}s (server total: ${response.data.totalSeconds}s)`,
      );

      return true;
    } catch (error) {
      console.error("[ApiClient]: Write failed:", error);

      if (this.looksLikeNetworkError(error)) {
        this.enqueue(data);
        console.log("[ApiClient] Queued for retry (network error).");
      }

      return false;
    }
  }

  /**
   * Cleanup
   */
  async dispose(): Promise<void> {
    if (this.offlineQueue.length > 0) {
      console.log("[ApiClient] Draining offline queue before shutdown...");
      await this.drainOfflineQueue();
    }
  }

  // Private methods

  private enqueue(data: IDayData): void {
    this.offlineQueue.push({
      date: data.date,
      data,
      timestamp: Date.now(),
    });
    console.log(`[ApiClient] Offline queue size: ${this.offlineQueue.length}`);
  }

  private async drainOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) {
      return;
    }

    console.log(
      `[ApiClient] Draining ${this.offlineQueue.length} queued update(s)...`,
    );

    const batch = this.offlineQueue;
    this.offlineQueue = [];

    for (const item of batch) {
      await this.writeDayData(item.data);
    }

    if (this.offlineQueue.length > 0) {
      console.log(
        `[ApiClient] ${this.offlineQueue.length} item(s) still queued.`,
      );
    } else {
      console.log("[ApiClient]: Queue fully drained.");
    }
  }

  private looksLikeNetworkError(error: unknown): boolean {
    const msg = (
      error instanceof Error ? error.message : String(error)
    ).toLowerCase();
    return (
      msg.includes("network") ||
      msg.includes("fetch") ||
      msg.includes("enotfound") ||
      msg.includes("econnrefused") ||
      msg.includes("etimedout") ||
      msg.includes("timeout")
    );
  }
}
