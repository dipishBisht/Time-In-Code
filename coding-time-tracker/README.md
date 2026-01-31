# Coding Time Tracker

Automatically tracks how long you code each day inside VS Code.

## How it works

```
┌─────────────────────┐        writes every        ┌──────────────┐
│   VS Code Extension │   ──────  10 min  ─────►   │  Firebase    │
│  (coding-time-      │                             │  Firestore   │
│   tracker/)         │                             │              │
└─────────────────────┘                             └──────┬───────┘
```

The extension detects when you are actively typing, pauses after 60 seconds of idle, and batches the totals into a single Firestore document per day.

## Repo layout

```
.
├── .gitignore                  # Covers both the extension and the Next.js app
├── README.md                   # This file
├── coding-time-tracker/        # The VS Code extension (pure Node.js + TypeScript)
└── (next app files here)       # Next.js docs — created later
```

## Getting started

### 1. Prerequisites

- Node.js 18+
- npm 9+
- VS Code (obviously)
- A Firebase project with Firestore enabled

### 2. Set up the extension

```bash
cd coding-time-tracker
npm install
npm run compile
```

Press **F5** in VS Code. A new *Extension Development Host* window opens. On first run it will ask you to paste your Firebase service account JSON — generate one from **Firebase Console → Project Settings → Service Accounts → Generate new private key**.

### 3. Verify it works

1. Open any code file in the Extension Development Host window and type something.
2. Stop typing and wait 65 seconds.
3. In the original VS Code window, open the **Debug Console** (Ctrl + Shift + J). You should see flush and sync logs.
4. Go to **Firebase Console → Firestore Database**. Under `users/{your-uuid}/days/{today}` you will see the seconds you just tracked.

## Firestore data shape

Every sync writes (or merges into) a single document at this path:

```
users/{userId}/days/{YYYY-MM-DD}
```

The document looks like this:

```json
{
  "date": "2026-02-01",
  "totalSeconds": 28800,
  "languages": {
    "typescript": 18000,
    "javascript": 7200,
    "css": 3600
  }
}
```

- `totalSeconds` — sum of all language values for that day.
- `languages` — keys are VS Code `languageId` strings. Values are seconds.
- Writes are **additive**. Each 10-minute sync adds a delta; it never overwrites the full day.

## Key design decisions

| Decision | What | Why |
|---|---|---|
| Sync interval | 10 minutes | Balances real-time feel against Firebase write quota |
| Idle timeout | 60 seconds | Long enough to avoid false pauses during thinking |
| Auth | Service account key | Simplest path to Admin SDK. No OAuth flow needed |
| Credential storage | VS Code Secrets API | Encrypted at rest. Never touches disk as plaintext |
| Offline handling | In-memory queue | Covers the common case (brief network blip) without adding a local DB |
| User ID | Local UUID in globalState | No sign-in required. One ID per VS Code installation |
| Date in local time | `getFullYear/getMonth/getDate` | "Today" should match the developer's clock, not UTC |

## Common pitfalls

**Extension does not activate.** Check that `activationEvents` in `package.json` is `["onStartupFinished"]` and that you compiled (`npm run compile`) before pressing F5.

**Firebase write fails silently.** Open the Debug Console in your *development* VS Code window (not the host). All Firebase errors log there.

**Time keeps ticking after VS Code closes.** It does not — `stop()` flushes and syncs on deactivation. If you see inflated numbers, check whether you have multiple Extension Development Host windows open.

**Midnight rollover loses time.** Handled. When the date changes mid-session, the old day is synced immediately before the new day starts accumulating.

## License

MIT