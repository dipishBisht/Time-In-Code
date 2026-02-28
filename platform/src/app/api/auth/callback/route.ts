import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import crypto from "crypto";
import axios from "axios";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@/lib/env";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const storedState = request.cookies.get("oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.json(
      { error: "Invalid OAuth state or missing code" },
      { status: 400 },
    );
  }

  try {
    // Exchange code for GitHub access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    const tokenData = tokenRes.data;

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Failed to get GitHub access token" },
        { status: 400 },
      );
    }

    // Fetch GitHub user profile
    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const githubUser = userRes.data;

    await connectToDatabase();

    // Atomic upsert with race condition handling
    let user = await User.findOne({ githubId: githubUser.id.toString() });

    if (!user) {
      try {
        user = await User.create({
          githubId: githubUser.id.toString(),
          githubUsername: githubUser.login,
          avatarUrl: githubUser.avatar_url,
          token: crypto.randomBytes(32).toString("hex"),
        });
      } catch (error: any) {
        // Handle race condition (duplicate key)
        if (error.code === 11000) {
          user = await User.findOne({ githubId: githubUser.id.toString() });
          if (!user) {
            throw new Error("User creation race condition unresolved");
          }
        } else {
          throw error;
        }
      }
    }

    // Pass BOTH token AND githubId to extension
    const redirectUrl = `vscode://DipishBisht.time-in-code/auth?token=${user.token}&githubId=${user.githubId}`;

    const response = NextResponse.redirect(redirectUrl);

    // Clear OAuth state cookie
    response.cookies.delete("oauth_state");

    return response;
  } catch (error) {
    console.error("GitHub OAuth Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
