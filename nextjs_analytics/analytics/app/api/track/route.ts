import { NextResponse } from "next/server";

const events: any[] = [];
const MAX_EVENTS = 1000;

export async function POST(request: Request) {
  try {
    const event = await request.json();

    // Validate required fields
    if (!event.eventName) {
      return NextResponse.json({ error: "Missing eventName" }, { status: 400 });
    }

    if (!event.userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Add server timestamp
    const enrichedEvent = {
      ...event,
      serverTimestamp: new Date().toISOString(),
      id: generateEventId(),
    };

    // Store event (keep only latest MAX_EVENTS)
    events.push(enrichedEvent);
    if (events.length > MAX_EVENTS) {
      events.shift(); // Remove oldest event
    }

    // Pretty console logging for development
    console.log("\n📊 Analytics Event Received:");
    console.log("━".repeat(60));
    console.log(`📌 Event: ${event.eventName}`);
    console.log(`👤 User: ${event.userId}`);
    console.log(`🔑 Session: ${event.sessionId}`);
    console.log(`⏰ Timestamp: ${event.timestamp}`);

    if (event.properties && Object.keys(event.properties).length > 0) {
      console.log(`📦 Properties:`, JSON.stringify(event.properties, null, 2));
    }

    if (event.context) {
      console.log(`🌐 Context:`);
      console.log(`   • URL: ${event.context.url}`);
      console.log(`   • Referrer: ${event.context.referrer || "Direct"}`);
      console.log(`   • Device: ${event.context.platform}`);
      console.log(
        `   • Viewport: ${event.context.viewportWidth}x${event.context.viewportHeight}`
      );

      if (event.context.utm && Object.keys(event.context.utm).length > 0) {
        console.log(`   • UTM:`, event.context.utm);
      }
    }

    console.log("━".repeat(60));
    console.log(`📈 Total events stored: ${events.length}\n`);
    console.log("events array", event);

    return NextResponse.json({
      success: true,
      eventId: enrichedEvent.id,
      message: "Event tracked successfully",
    });
  } catch (error) {
    console.error("❌ Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint - retrieve analytics data for testing/dashboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get("event");
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Filter events
    let filteredEvents = [...events];

    if (eventName) {
      filteredEvents = filteredEvents.filter((e) => e.eventName === eventName);
    }

    if (userId) {
      filteredEvents = filteredEvents.filter((e) => e.userId === userId);
    }

    // Get latest events (reverse chronological)
    const results = filteredEvents.slice(-limit).reverse();

    // Generate summary statistics
    const stats = generateStats(events);

    return NextResponse.json({
      success: true,
      count: results.length,
      totalEvents: events.length,
      events: results,
      stats,
      filters: { eventName, userId, limit },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint - clear all events (for testing)
export async function DELETE() {
  const count = events.length;
  events.length = 0; // Clear array

  console.log(`🗑️  Cleared ${count} analytics events`);

  return NextResponse.json({
    success: true,
    message: `Deleted ${count} events`,
    deletedCount: count,
  });
}

// Helper: Generate unique event ID
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper: Generate statistics
function generateStats(events: any[]) {
  const stats: any = {
    totalEvents: events.length,
    uniqueUsers: new Set(events.map((e) => e.userId)).size,
    uniqueSessions: new Set(events.map((e) => e.sessionId)).size,
    eventTypes: {},
    topPages: {},
    deviceTypes: {},
    browsers: {},
  };

  events.forEach((event) => {
    // Count event types
    stats.eventTypes[event.eventName] =
      (stats.eventTypes[event.eventName] || 0) + 1;

    // Count page views
    if (event.eventName === "pageview" && event.properties?.page) {
      const page = event.properties.page;
      stats.topPages[page] = (stats.topPages[page] || 0) + 1;
    }

    // Analyze user agents (simplified)
    if (event.context?.userAgent) {
      const ua = event.context.userAgent.toLowerCase();

      if (ua.includes("mobile")) {
        stats.deviceTypes.mobile = (stats.deviceTypes.mobile || 0) + 1;
      } else if (ua.includes("tablet")) {
        stats.deviceTypes.tablet = (stats.deviceTypes.tablet || 0) + 1;
      } else {
        stats.deviceTypes.desktop = (stats.deviceTypes.desktop || 0) + 1;
      }

      // Browser detection
      if (ua.includes("chrome")) {
        stats.browsers.chrome = (stats.browsers.chrome || 0) + 1;
      } else if (ua.includes("firefox")) {
        stats.browsers.firefox = (stats.browsers.firefox || 0) + 1;
      } else if (ua.includes("safari")) {
        stats.browsers.safari = (stats.browsers.safari || 0) + 1;
      } else {
        stats.browsers.other = (stats.browsers.other || 0) + 1;
      }
    }
  });

  // Sort event types by count
  stats.eventTypes = Object.fromEntries(
    Object.entries(stats.eventTypes).sort(([, a]: any, [, b]: any) => b - a)
  );

  // Sort top pages by count
  stats.topPages = Object.fromEntries(
    Object.entries(stats.topPages)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 10) // Top 10 pages
  );

  return stats;
}
