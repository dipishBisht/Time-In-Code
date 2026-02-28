/**
 * Daily coding statistics
 */
export interface IDayData {
  date: string; // Format: YYYY-MM-DD
  totalSeconds: number;
  languages: Record<string, number>; // { typescript: 1800, javascript: 900 }
}

/**
 * Queued update for offline mode
 */
export interface IQueuedUpdate {
  date: string;
  data: IDayData;
  timestamp: number;
}
