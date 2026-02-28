export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID) {
  throw new Error("Missing GITHUB_CLIENT_ID environment variable");
}

if (!GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GITHUB_CLIENT_SECRET environment variable");
}

// Base URL for OAuth callbacks
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

console.log("[ENV] ✅ BASE_URL:", BASE_URL);
