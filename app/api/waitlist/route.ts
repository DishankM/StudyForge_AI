import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const WAITLIST_PATH = path.join(process.cwd(), "data", "waitlist.json");

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });

    let entries: { email: string; joinedAt: string }[] = [];
    try {
      const raw = await fs.readFile(WAITLIST_PATH, "utf-8");
      entries = JSON.parse(raw);
    } catch {
      entries = [];
    }

    if (entries.some((e) => e.email === email)) {
      return NextResponse.json(
        { success: true, message: "You're already on the list!" },
        { status: 200 }
      );
    }

    entries.push({
      email,
      joinedAt: new Date().toISOString(),
    });

    await fs.writeFile(
      WAITLIST_PATH,
      JSON.stringify(entries, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      { success: true, message: "You're on the list! We'll be in touch." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
