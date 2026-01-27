// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     // Verify API key
//     const apiKey = request.headers.get("X-API-Key");
//     // if (!apiKey || apiKey !== process.env.ANALYTICS_API_KEY) {
//     //   return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
//     // }

//     const body = await request.json();
//     const { events: eventBatch } = body;

//     if (!Array.isArray(eventBatch) || eventBatch.length === 0) {
//       return NextResponse.json(
//         { error: "events array is required" },
//         { status: 400 }
//       );
//     }

//     const results = [];

//     for (const event of eventBatch) {
//       const { userId, event: eventName, properties, timestamp } = event;

//       if (!eventName || (!userId && !event.anonymousId)) {
//         results.push({
//           success: false,
//           error: "Missing required fields",
//         });
//         continue;
//       }

//       console.log("📊 Batch event:", {
//         event: eventName,
//         userId,
//         properties,
//       });

//       results.push({
//         success: true,
//         event: eventName,
//         userId,
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       processed: results.length,
//       results,
//     });
//   } catch (error) {
//     console.error("❌ Batch track error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // ============================================
// // FILE: /app/api/analytics/debug/route.ts
// // Debug endpoint to view stored data
// // ============================================

// // Import the in-memory stores (in production, query database)
// const users = new Map<string, any>();
// const events = new Map<string, any[]>();

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const userId = searchParams.get("userId");

//     if (userId) {
//       // Get specific user data
//       const user = users.get(userId);
//       const userEvents = events.get(userId) || [];

//       return NextResponse.json({
//         user: user || null,
//         events: userEvents,
//         eventCount: userEvents.length,
//       });
//     }

//     // Get all data
//     return NextResponse.json({
//       users: Array.from(users.values()),
//       totalUsers: users.size,
//       totalEvents: Array.from(events.values()).reduce(
//         (sum, userEvents) => sum + userEvents.length,
//         0
//       ),
//       recentEvents: Array.from(events.values())
//         .flat()
//         .sort((a, b) => b.timestamp - a.timestamp)
//         .slice(0, 20),
//     });
//   } catch (error) {
//     console.error("❌ Debug error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    // const apiKey = request.headers.get("X-API-Key");
    // if (!apiKey || apiKey !== process.env.ANALYTICS_API_KEY) {
    //   return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    // }

    const body = await request.json();
    const { events: eventBatch } = body;

    if (!Array.isArray(eventBatch) || eventBatch.length === 0) {
      return NextResponse.json(
        { error: "events array is required" },
        { status: 400 }
      );
    }

    const results = [];

    for (const event of eventBatch) {
      const { userId, event: eventName, properties, timestamp } = event;

      if (!eventName || (!userId && !event.anonymousId)) {
        results.push({
          success: false,
          error: "Missing required fields",
        });
        continue;
      }

      console.log("📊 Batch event:", {
        event: eventName,
        userId,
        properties,
      });

      results.push({
        success: true,
        event: eventName,
        userId,
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("❌ Batch track error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
