import CodeBlock from "@/components/docs/code-block";

export default function ApiReference() {
  return (
    <div>
      <h1>API Reference</h1>
      <p>All available endpoints for the Time in Code API.</p>

      <div className="mt-6 p-4 rounded-lg border bg-muted/30 text-sm">
        <strong>Base URL:</strong> <code>https://time-in-code.vercel.app</code>
      </div>

      {/* POST /api/track */}
      <h2>POST /api/track</h2>
      <p>Submit tracking data from the VS Code extension.</p>

      <h3>Request</h3>
      <CodeBlock
        title="POST /api/track"
        code={`POST /api/track
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "date": "2026-02-28",
  "totalSeconds": 600,
  "languages": {
    "typescript": 600
  }
}`}
      />

      <div className="mt-4 p-4 rounded-lg border bg-primary/5">
        <p className="text-sm font-medium mb-2">🔄 Changed from v0.1.x</p>
        <p className="text-sm text-muted-foreground">
          No longer requires <code>userId</code> in the request body. The
          backend derives your GitHub ID from the token automatically.
        </p>
      </div>

      <h3>Response (200)</h3>
      <CodeBlock
        language="json"
        title="Success"
        code={`{
  "success": true,
  "githubId": "12345678",
  "date": "2026-02-28",
  "totalSeconds": 600,
  "languages": {
    "typescript": 600
  },
  "formattedDuration": "10m"
}`}
      />

      <h3>Error Codes</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-3">
                <code>400</code>
              </td>
              <td className="px-4 py-3">Invalid request body</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3">
                <code>401</code>
              </td>
              <td className="px-4 py-3">Invalid or missing token</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* GET /api/stats/:githubId */}
      <h2>GET /api/stats/:githubId</h2>
      <p>
        Retrieve tracking stats for a user. Public endpoint — no authentication
        required.
      </p>

      <h3>Request</h3>
      <CodeBlock
        title="GET /api/stats/:githubId"
        code={`GET /api/stats/12345678?startDate=2026-02-01&endDate=2026-02-28&limit=30`}
      />

      <h3>Parameters</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Param</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-3">
                <code>githubId</code>
              </td>
              <td className="px-4 py-3">string</td>
              <td className="px-4 py-3">GitHub ID (path param)</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3">
                <code>startDate</code>
              </td>
              <td className="px-4 py-3">string</td>
              <td className="px-4 py-3">YYYY-MM-DD filter start (optional)</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3">
                <code>endDate</code>
              </td>
              <td className="px-4 py-3">string</td>
              <td className="px-4 py-3">YYYY-MM-DD filter end (optional)</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3">
                <code>limit</code>
              </td>
              <td className="px-4 py-3">number</td>
              <td className="px-4 py-3">
                Days to return (default: 30, max: 365)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Response (200)</h3>
      <CodeBlock
        language="json"
        title="Success"
        code={`{
  "githubId": "12345678",
  "userName": "octocat",
  "avatarUrl": "https://avatars.githubusercontent.com/u/12345678",
  "data": [
    {
      "date": "2026-02-28",
      "totalSeconds": 3600,
      "languages": { "typescript": 2400, "python": 1200 },
      "formattedDuration": "1h"
    }
  ],
  "totalSeconds": 86400,
  "totalDays": 30,
  "averageSecondsPerDay": 2880,
  "formattedAverage": "48m"
}`}
      />

      {/* GET /api/dashboard/:githubId */}
      <h2>GET /api/dashboard/:githubId</h2>
      <p>Returns full dashboard analytics for charts and insights.</p>

      <h3>Request</h3>
      <CodeBlock
        title="GET /api/dashboard/:githubId"
        code="GET /api/dashboard/12345678?days=30"
      />

      <h3>Parameters</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Param</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-3">
                <code>days</code>
              </td>
              <td className="px-4 py-3">number</td>
              <td className="px-4 py-3">
                Range to analyze (default 30, max 365)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Response (200)</h3>
      <CodeBlock
        language="json"
        title="Success"
        code={`{
  "githubId": "12345678",
  "userName": "octocat",
  "avatarUrl": "https://avatars.githubusercontent.com/u/12345678",
  "hasData": true,

  "overview": {
    "totalHours": 42,
    "totalMinutes": 15,
    "totalSeconds": 152100,
    "totalDays": 18,
    "averageHoursPerDay": 2.3,
    "formattedTotal": "42h 15m"
  },

  "charts": {
    "dailyTrend": [],
    "languageBreakdown": [],
    "dayOfWeekPattern": []
  },

  "achievements": {
    "currentStreak": 5,
    "longestStreak": 12,
    "peakDay": {
      "date": "2026-02-10",
      "hours": 6.2
    }
  }
}`}
      />
    </div>
  );
}
