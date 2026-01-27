import { NextRequest, NextResponse } from "next/server";

// Import the in-memory stores (in production, query database)
const users = new Map<string, any>();
const events = new Map<string, any[]>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (userId) {
      // Get specific user data
      const user = users.get(userId);
      const userEvents = events.get(userId) || [];

      return NextResponse.json({
        user: user || null,
        events: userEvents,
        eventCount: userEvents.length,
      });
    }

    // Get all data
    return NextResponse.json({
      users: Array.from(users.values()),
      totalUsers: users.size,
      totalEvents: Array.from(events.values()).reduce(
        (sum, userEvents) => sum + userEvents.length,
        0
      ),
      recentEvents: Array.from(events.values())
        .flat()
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20),
    });
  } catch (error) {
    console.error("❌ Debug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
