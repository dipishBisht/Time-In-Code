import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Tracking, { ITracking } from "@/models/Tracking";
import User from "@/models/User";
import { withCors } from "@/lib/cors";

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
    const daysParam = searchParams.get("days");

    let days = 30;
    if (daysParam) {
      const parsed = parseInt(daysParam, 10);
      if (isNaN(parsed) || parsed < 1) {
        return withCors(
          NextResponse.json(
            { error: "days must be a positive number" },
            { status: 400 },
          ),
        );
      }
      days = Math.min(parsed, 365);
    }

    // Connect to database
    await connectToDatabase();

    // Fetch user profile by githubId
    const user = await User.findOne({ githubId }).select(
      "githubUsername avatarUrl createdAt",
    );

    if (!user) {
      return withCors(
        NextResponse.json({
          githubId,
          hasData: false,
          message: "No tracking data found for this user.",
        }),
      );
    }

    // Calculate date range
    const now = new Date();
    const endDateStr = now.toISOString().slice(0, 10);

    const start = new Date(now);
    start.setUTCDate(start.getUTCDate() - days);
    const startDateStr = start.toISOString().slice(0, 10);

    // Fetch tracking data by githubId
    const trackingData = await Tracking.find({
      githubId,
      date: { $gte: startDateStr, $lte: endDateStr },
    })
      .sort({ date: 1 })
      .lean();

    if (trackingData.length === 0) {
      return withCors(
        NextResponse.json({
          githubId,
          userName: user.githubUsername,
          hasData: false,
          message: `No coding activity in the last ${days} days.`,
        }),
      );
    }

    // Calculate overview statistics
    const totalSeconds = trackingData.reduce(
      (sum, day) => sum + day.totalSeconds,
      0,
    );
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalDays = trackingData.length;
    const averageSecondsPerDay = Math.round(totalSeconds / totalDays);

    // Build daily trend chart data
    const dailyTrend = trackingData.map((day) => ({
      date: day.date,
      hours: parseFloat((day.totalSeconds / 3600).toFixed(2)),
      seconds: day.totalSeconds,
    }));

    // Calculate language breakdown
    const languageTotals = new Map<string, number>();

    trackingData.forEach((day) => {
      for (const [lang, seconds] of Object.entries(day.languages)) {
        languageTotals.set(
          lang,
          (languageTotals.get(lang) || 0) + (seconds as number),
        );
      }
    });

    const languageBreakdown = Array.from(languageTotals.entries())
      .map(([language, seconds]) => ({
        language,
        seconds,
        hours: parseFloat((seconds / 3600).toFixed(2)),
        percentage: parseFloat(((seconds / totalSeconds) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.seconds - a.seconds);

    // Recent activity
    const recentActivity = trackingData
      .slice(-7)
      .reverse()
      .map((day) => {
        const topLanguage = Object.entries(day.languages).sort(
          ([, a], [, b]) => (b as number) - (a as number),
        )[0];

        return {
          date: day.date,
          totalSeconds: day.totalSeconds,
          formattedTime: formatDuration(day.totalSeconds),
          topLanguage: topLanguage ? topLanguage[0] : "unknown",
          languageCount: Object.keys(day.languages).length,
        };
      });

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(trackingData);

    // Find peak coding day
    const peakDay = trackingData.reduce(
      (max, day) => (day.totalSeconds > max.totalSeconds ? day : max),
      trackingData[0],
    );

    // Calculate milestones
    const milestones = calculateMilestones(
      totalHours,
      totalDays,
      currentStreak,
    );

    // Calculate day-of-week pattern
    const dayOfWeekPattern = calculateDayOfWeekPattern(trackingData);

    return withCors(
      NextResponse.json({
        githubId,
        userName: user.githubUsername || null,
        avatarUrl: user.avatarUrl || null,
        joinDate: user.createdAt ? formatDate(new Date(user.createdAt)) : null,
        hasData: true,

        overview: {
          totalHours,
          totalMinutes,
          totalSeconds,
          totalDays,
          averageSecondsPerDay,
          averageHoursPerDay: parseFloat(
            (averageSecondsPerDay / 3600).toFixed(2),
          ),
          formattedTotal: `${totalHours}h ${totalMinutes}m`,
          formattedAverage: formatDuration(averageSecondsPerDay),
        },

        charts: {
          dailyTrend,
          languageBreakdown,
          dayOfWeekPattern,
        },

        recentActivity,

        achievements: {
          currentStreak,
          longestStreak,
          peakDay: {
            date: peakDay.date,
            hours: parseFloat((peakDay.totalSeconds / 3600).toFixed(2)),
            formattedTime: formatDuration(peakDay.totalSeconds),
          },
          milestones,
        },

        dateRange: {
          start: startDateStr,
          end: endDateStr,
          days,
        },
      }),
    );
  } catch (error) {
    console.error("[API]: Dashboard endpoint error:", error);
    return withCors(
      NextResponse.json({ error: "Internal server error" }, { status: 500 }),
    );
  }
}

// Helper Functions
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

function calculateStreaks(trackingData: ITracking[]) {
  if (!trackingData.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sorted = [...trackingData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const dates = sorted.map((d) => d.date);

  let longest = 1;
  let run = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);

    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  let current = 0;
  let cursor = new Date().toISOString().slice(0, 10);

  const dateSet = new Set(dates);

  while (dateSet.has(cursor)) {
    current++;
    const d = new Date(cursor);
    d.setUTCDate(d.getUTCDate() - 1);
    cursor = d.toISOString().slice(0, 10);
  }

  return {
    currentStreak: current,
    longestStreak: longest,
  };
}

function calculateMilestones(
  totalHours: number,
  totalDays: number,
  currentStreak: number,
): Array<{
  title: string;
  achieved: boolean;
  progress?: number;
  target?: number;
}> {
  return [
    {
      title: "First Hour",
      achieved: totalHours >= 1,
      progress: totalHours >= 1 ? 1 : totalHours,
      target: 1,
    },
    {
      title: "10 Hours Coded",
      achieved: totalHours >= 10,
      progress: Math.min(totalHours, 10),
      target: 10,
    },
    {
      title: "100 Hours Coded",
      achieved: totalHours >= 100,
      progress: Math.min(totalHours, 100),
      target: 100,
    },
    {
      title: "1000 Hours Coded",
      achieved: totalHours >= 1000,
      progress: Math.min(totalHours, 1000),
      target: 1000,
    },
    {
      title: "7-Day Streak",
      achieved: currentStreak >= 7,
      progress: Math.min(currentStreak, 7),
      target: 7,
    },
    {
      title: "30-Day Streak",
      achieved: totalDays >= 30,
      progress: Math.min(totalDays, 30),
      target: 30,
    },
  ];
}

function calculateDayOfWeekPattern(trackingData: ITracking[]): Array<{
  day: string;
  dayNumber: number;
  averageSeconds: number;
  averageHours: number;
  totalDays: number;
}> {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayTotals = new Map<number, { total: number; count: number }>();

  for (let i = 0; i < 7; i++) {
    dayTotals.set(i, { total: 0, count: 0 });
  }

  trackingData.forEach((day) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();

    const current = dayTotals.get(dayOfWeek)!;
    dayTotals.set(dayOfWeek, {
      total: current.total + day.totalSeconds,
      count: current.count + 1,
    });
  });

  return Array.from(dayTotals.entries()).map(
    ([dayNumber, { total, count }]) => ({
      day: daysOfWeek[dayNumber],
      dayNumber,
      averageSeconds: count > 0 ? Math.round(total / count) : 0,
      averageHours:
        count > 0 ? parseFloat((total / count / 3600).toFixed(2)) : 0,
      totalDays: count,
    }),
  );
}
