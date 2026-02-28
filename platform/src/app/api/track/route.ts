import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Tracking from "@/models/Tracking";
import { withCors } from "@/lib/cors";

/**
 * POST /api/track
 *
 * Body: {
 *   date: string,
 *   totalSeconds: number,
 *   languages: { typescript: 1800, javascript: 900 }
 * }
 *
 * Headers: {
 *   Authorization: "Bearer <token>"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Extract and validate token
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return withCors(
        NextResponse.json(
          { error: "Missing or invalid Authorization header" },
          { status: 401 },
        ),
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token || token.length < 16) {
      return withCors(
        NextResponse.json({ error: "Invalid token format" }, { status: 401 }),
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return withCors(
        NextResponse.json(
          { error: "Invalid JSON in request body" },
          { status: 400 },
        ),
      );
    }

    const { date, totalSeconds, languages } = body;

    // Validate required fields
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return withCors(
        NextResponse.json(
          { error: "date is required and must be in YYYY-MM-DD format" },
          { status: 400 },
        ),
      );
    }

    if (typeof totalSeconds !== "number" || totalSeconds < 0) {
      return withCors(
        NextResponse.json(
          { error: "totalSeconds must be a non-negative number" },
          { status: 400 },
        ),
      );
    }

    if (!languages || typeof languages !== "object") {
      return withCors(
        NextResponse.json(
          { error: "languages is required and must be an object" },
          { status: 400 },
        ),
      );
    }

    // Validate language seconds
    for (const [lang, seconds] of Object.entries(languages)) {
      if (typeof seconds !== "number" || (seconds as number) < 0) {
        return withCors(
          NextResponse.json(
            { error: `Invalid seconds value for language: ${lang}` },
            { status: 400 },
          ),
        );
      }
    }

    // Connect to database
    await connectToDatabase();

    // Verify user by token
    const user = await User.findOne({ token });

    if (!user) {
      return withCors(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    // Use githubId from authenticated user (source of truth)
    const tracking = await Tracking.mergeTrackingData(
      user.githubId,
      date,
      totalSeconds,
      languages,
    );

    console.log(
      `[API] Synced ${user.githubId} / ${date}: +${totalSeconds}s (total: ${tracking.totalSeconds}s)`,
    );

    // Return success response
    return withCors(
      NextResponse.json({
        success: true,
        githubId: tracking.githubId,
        date: tracking.date,
        totalSeconds: tracking.totalSeconds,
        languages:
          tracking.languages instanceof Map
            ? Object.fromEntries(tracking.languages)
            : tracking.languages,
        formattedDuration: tracking.formatDuration(),
      }),
    );
  } catch (error) {
    console.error("[API]: Track endpoint error:", error);

    // Mongoose validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return withCors(
        NextResponse.json(
          { error: "Validation error", details: error.message },
          { status: 400 },
        ),
      );
    }

    // Duplicate key error
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return withCors(
        NextResponse.json(
          { error: "Duplicate entry detected" },
          { status: 409 },
        ),
      );
    }

    return withCors(
      NextResponse.json({ error: "Internal server error" }, { status: 500 }),
    );
  }
}
