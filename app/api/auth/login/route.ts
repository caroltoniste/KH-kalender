import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.TEAM_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: "Serveri viga: parool pole seadistatud" },
        { status: 500 }
      );
    }

    if (password !== correctPassword) {
      return NextResponse.json(
        { error: "Vale parool" },
        { status: 401 }
      );
    }

    // Set session cookie (8 hours)
    const cookieStore = await cookies();
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
    
    cookieStore.set("kitten-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Serveri viga" },
      { status: 500 }
    );
  }
}
