# Time In Code

Automatically track your daily coding time in VS Code and can sync it to a centralized API.

## Architecture Overview

```
┌─────────────────────┐                           ┌──────────────────┐
│   VS Code Extension │    POST /api/track        │  Next.js API     │
│  (time-in-code/)    │  ────────────────────►    │  + MongoDB       │
│                     │    every 20 min           │  + Docs Site     │
│                     │                           │                  │
│  • Tracks time      │                           │  • Validates     │
│  • Detects idle     │                           │  • Stores data   │
│  • Batches writes   │                           │  • Serves docs   │
└─────────────────────┘                           └────────┬─────────┘
                                                           │
                                                           │ GET /api/stats/:userId
                                                           │
                                                           ▼
                                                  ┌──────────────────┐
                                                  │Can use anywhere  │
                                                  │  (anyone's site) │
                                                  │                  │
                                                  │  Fetches & shows │
                                                  │  coding stats    │
                                                  └──────────────────┘
```

**How it works:**
1. Extension tracks your coding activity in real-time
2. Every 20 minutes, it sends accumulated data to your API
3. API validates, merges, and stores in MongoDB
4. Your portfolio (or anyone's) fetches stats from the public API endpoint
5. Documentation site explains how developers can use the API

---

## First Time Here? Start Here!

**Complete setup in 3 steps (2 minutes total):**

### Step 1: Install the Extension  

### Step 2: Generate Your Token
  1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
  2. Type: **"Time in Code: Login with Github"**
  3. Authorize

### Step 3: Start Coding
Open any file and type. That's it! The extension tracks automatically.

**View your stats:**
1. Press `Ctrl+Shift+P` again
2. Type: **"Time in Code: Show Dashboard"**
4. Click: Open

**Need help?** → [Troubleshooting](#troubleshooting) | [Full Documentation](https://your-api.vercel.app/docs)

---

## Repository Structure

```
.
├── README.md                        # This file
├── .gitignore                       # Covers both projects
├── time-in-code/             # VS Code extension (TypeScript + Node.js)
│   ├── src/
│   ├── package.json
│   └── README.md                    # Extension-specific docs
└── platform/                 # Next.js API + documentation site
    ├── app/
    │   ├── api/                     # API routes
    │   ├── docs/                    # Documentation pages
    │   └── page.tsx                 # Homepage
    ├── models/                      # Mongoose schemas
    ├── lib/                         # Database connection
    └── README.md                    # API-specific docs
```

---

## Quick Start

### 1. Set Up the API (Do This First)

The extension needs a running API to send data to.

```bash
# Create Next.js app
npx create-next-app@latest platform
cd platform

# Install Mongoose
npm install mongoose

# Copy API files from this repo (see platform/README.md)
# Set up MongoDB Atlas (free tier)
# Configure .env.local with MONGODB_URI
# Deploy to Vercel

npm run dev  # Test locally
vercel       # Deploy
```

**📖 Full API setup guide:** See [`platform/README.md`](./platform/README.md)

---

### 2. Install the Extension

```bash
cd time-in-code
npm install
npm run compile

# Package as .vsix
npm install -g @vscode/vsce
vsce package

# Install in VS Code
code --install-extension ./time-in-code-0.1.0.vsix
```

**📖 Full extension guide:** See [`time-in-code/README.md`](./time-in-code/README.md)

---

### 3. Configure the Extension

1. Open VS Code
2. Press `Ctrl+Shift+P` → "Time in Code: Login with Github"
3. Authorize

---

### 4. View Your Stats

Go to: `https://time-in-code.vercel.app/api/stats/GITHUB_ID`

Get your user ID from: `Ctrl+Shift+P` → "Coding Time: Show Account's Info"

---

## For Extension Users

### Installation

1. Download the latest `.vsix` from [Releases](https://github.com/dipishBisht/Time-In-Code/releases)
2. Run: `code --install-extension time-in-code-0.1.0.vsix`
3. Configure your token (first-run prompt will guide you)

### Commands

| Command | What It Does |
|---|---|
| **Coding Time: Login with Github** | Set up your token (first run) |
| **Coding Time: Show Dashboard** | See your user ID and stats link |
| **Coding Time: Show Account Info** | Retrieve your details if you lost it |

### How It Tracks

- Starts tracking when you type in any file
- Pauses after 60 seconds of idle
- Syncs every 20 minutes
- Works offline (queues updates when network is down)
- Handles midnight rollover correctly

---

## For Developers

### Using the API in Your Portfolio

```tsx
// React component example
'use client';

import { useEffect, useState } from 'react';

export default function CodingStats() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetch('https://time-in-code.vercel.app/api/stats/GITHUB_ID?limit=30')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Coding Stats (Last 30 Days)</h2>
      <p>Total: {Math.floor(stats.totalSeconds / 3600)} hours</p>
      <p>Days active: {stats.totalDays}</p>
    </div>
  );
}
```

### API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/track` | POST | Extension writes data here (requires token) |
| `/api/stats/:githubId` | GET | Public endpoint to fetch stats |
| `/docs` | GET | Documentation site |

**📖 Full API documentation:** See [`platform/README.md`](./platform/README.md)

---

## Why This Architecture?

### ❌ Original Plan: Direct Firebase Writes

```
Extension → Firebase (20k writes/day limit)
Portfolio → Firebase Client SDK
```

**Problems:**
- Firebase free tier limits hit fast with multiple users
- No control over auth, rate limiting, or validation
- Everyone needs Firebase setup

### ✅ Current Architecture: Centralized API

```
Extension → Your API → MongoDB
Portfolio → Your API (public endpoint)
```

**Benefits:**
- MongoDB free tier: 512 MB storage (~3M records)
- Full control: authentication, rate limiting, features
- Users just need a token (no Firebase setup)
- Portfolio sites just call your API (no SDK needed)

---

## Technology Stack

### Extension
- TypeScript
- VS Code Extension API
- Native axios
- UUID for user identification

### API
- Next.js 16 (App Router)
- Mongoose + MongoDB
- TypeScript
- Vercel (deployment)

### Database Schema
- **Users** collection: `{ githubId, githubUsername, avatarUrl, token }`
- **Tracking** collection: `{ githubId, date, totalSeconds, languages }`
- Indexes on `githubId + date` for fast queries

---

## Key Features

### Extension
 Automatic idle detection (60s timeout)  
 Per-language time breakdown  
 Offline-safe (queues writes when network fails)  
 Midnight rollover handling  
 Token-based authentication  
 Clean shutdown (flushes data on VS Code exit)  

### API
 Mongoose schema validation  
 Automatic data merging (no duplicates)  
 Public stats endpoint (no auth required for reads)    
 Full TypeScript types  
 Query by date range  

---

## Documentation Site

The Next.js app serves both the API **and** documentation:

```
https://time-in-code.vercel.app/
├── /                     → Homepage
├── /docs                 → API documentation
│   ├── /docs/setup       → Extension setup guide
│   ├── /docs/api         → API reference
│   └── /docs/embed       → How to embed in portfolios
├── /stats/:userId        → Public stats page
└── /api/                 → API endpoints
```

**📖 Building the platform site:** Coming soon in `platform/README.md`

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test both the extension and API
5. Submit a PR

---

## Deployment

### Extension
- Package: `vsce package`
- Publish to Marketplace: `vsce publish`
- Or attach `.vsix` to GitHub releases

### API
- Deploy to Vercel: `vercel`
- Set `MONGODB_URI` in environment variables
- Domain: Use Vercel's auto-generated or add custom domain

---

## Roadmap

- [ ] Add user registration page
- [ ] Build dashboard with charts
- [ ] Language popularity stats
- [ ] VS Code Marketplace listing
- [ ] Public gallery of users
- [ ] Export data as JSON/CSV

---

## License

MIT

---

## Support

- **Extension issues:** Open an issue with the `extension` label
- **API issues:** Open an issue with the `api` label
- **Documentation:** Check the READMEs in each subfolder
- **Questions:** Start a discussion in Discussions tab

---

## Acknowledgments

Built with:
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Next.js](https://nextjs.org)
- [Mongoose](https://mongoosejs.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas)