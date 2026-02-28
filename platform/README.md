This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Time in Code API

Backend API for **Time in Code** — a VS Code extension that tracks coding time and syncs statistics securely using GitHub OAuth.

Built with:
- Next.js (App Router)
- MongoDB Atlas
- GitHub OAuth
- Deployed on Vercel

---

# Features

- GitHub OAuth authentication
- Secure token-based API
- Coding time aggregation
- Language breakdown tracking
- Dashboard analytics endpoint
- Public stats endpoint

---

# Authentication Flow

1. Extension redirects user to GitHub OAuth
2. GitHub returns authorization code
3. Backend exchanges code for access token
4. Backend retrieves:
   - GitHub ID
   - Username
   - Avatar
5. Backend generates secure internal token
6. Extension stores token securely
7. All API requests use:

Authorization: Bearer YOUR_TOKEN

No JWT required.
No Firebase.
No third-party auth services.

---

# API Routes

## POST /api/track

Tracks coding time.

Headers:

Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body:

```json
{
  "date": "2026-02-28",
  "totalSeconds": 600,
  "languages": {
    "typescript": 600
  }
}
