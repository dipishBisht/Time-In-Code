import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Tracking from "@/models/Tracking";
import User from "@/models/User";
import { withCors } from "@/lib/cors";

/**
 * GET /api/stats/:githubId
 *
 * Query params:
 *   - startDate (optional): "YYYY-MM-DD"
 *   - endDate (optional): "YYYY-MM-DD"
 *   - limit (optional): number of days (default: 30, max: 365)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ githubId: string }> },
) {
  try {
    const { githubId } = await params;

    // Validate githubId
    if (
      !githubId ||
      typeof githubId !== "string" ||
      githubId.trim().length === 0
    ) {
      return withCors(
        NextResponse.json(
          { error: "Invalid githubId parameter" },
          { status: 400 },
        ),
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limitParam = searchParams.get("limit");

    // Validate date formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (startDate && !dateRegex.test(startDate)) {
      return withCors(
        NextResponse.json(
          { error: "startDate must be in YYYY-MM-DD format" },
          { status: 400 },
        ),
      );
    }

    if (endDate && !dateRegex.test(endDate)) {
      return withCors(
        NextResponse.json(
          { error: "endDate must be in YYYY-MM-DD format" },
          { status: 400 },
        ),
      );
    }

    // Validate limit
    let limit = 30;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (isNaN(parsed) || parsed < 1) {
        return withCors(
          NextResponse.json(
            { error: "limit must be a positive number" },
            { status: 400 },
          ),
        );
      }
      limit = Math.min(parsed, 365);
    }

    // Connect to database
    await connectToDatabase();

    // Check if user exists by githubId
    const user = await User.findOne({ githubId }).select(
      "githubUsername avatarUrl",
    );

    if (!user) {
      return withCors(
        NextResponse.json({
          githubId,
          data: [],
          totalSeconds: 0,
          totalDays: 0,
          averageSecondsPerDay: 0,
          message: "No data found for this user",
        }),
      );
    }

    // Build Mongoose query
    const query: any = { githubId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Fetch tracking data
    const trackingDocs = await Tracking.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .select("-_id -__v")
      .lean();

    // Calculate aggregates
    const totalSeconds = trackingDocs.reduce(
      (sum, doc) => sum + doc.totalSeconds,
      0,
    );
    const totalDays = trackingDocs.length;
    const averageSecondsPerDay =
      totalDays > 0 ? Math.round(totalSeconds / totalDays) : 0;

    // Format response
    const data = trackingDocs.map((doc) => ({
      date: doc.date,
      totalSeconds: doc.totalSeconds,
      languages: doc.languages,
      formattedDuration: formatDuration(doc.totalSeconds),
    }));

    return withCors(
      NextResponse.json({
        githubId,
        userName: user.githubUsername,
        avatarUrl: user.avatarUrl,
        data,
        totalSeconds,
        totalDays,
        averageSecondsPerDay,
        formattedAverage: formatDuration(averageSecondsPerDay),
      }),
    );
  } catch (error) {
    console.error("[API]: Stats endpoint error:", error);
    return withCors(
      NextResponse.json({ error: "Internal server error" }, { status: 500 }),
    );
  }
}

// Helper Functions
function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}
