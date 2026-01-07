import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Your logic here
  return NextResponse.json({ message: "Export endpoint" });
}

// অথবা অন্য HTTP methods যদি দরকার হয়:
// export async function POST(request: NextRequest) { ... }
