// import { NextRequest, NextResponse } from "next/server";

// // In-memory storage for testing
// const events = new Map<string, any[]>();
// const campaigns = new Map<string, any>();

// // Sample campaigns for testing workflow triggers
// const sampleCampaigns = [
//   {
//     id: "welcome-email",
//     name: "Welcome Email",
//     trigger: "signed_up",
//     active: true,
//     filter: { plan: "trial" },
//   },
//   {
//     id: "cart-abandonment",
//     name: "Cart Abandonment",
//     trigger: "item_added_to_cart",
//     active: true,
//     filter: {},
//   },
//   {
//     id: "trial-ending",
//     name: "Trial Ending Soon",
//     trigger: "trial_ending_soon",
//     active: true,
//     filter: { days_remaining: 3 },
//   },
// ];

// // Initialize sample campaigns
// sampleCampaigns.forEach((campaign) => {
//   campaigns.set(campaign.id, campaign);
// });

// export async function POST(request: NextRequest) {
//   try {
//     // Verify API key
//     const apiKey = request.headers.get("X-API-Key");
//     // if (!apiKey || apiKey !== process.env.ANALYTICS_API_KEY) {
//     //   return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
//     // }

//     const body = await request.json();
//     const { userId, event, properties, timestamp, anonymousId } = body;

//     // Validate required fields
//     if (!event) {
//       return NextResponse.json({ error: "event is required" }, { status: 400 });
//     }

//     if (!userId && !anonymousId) {
//       return NextResponse.json(
//         { error: "userId or anonymousId is required" },
//         { status: 400 }
//       );
//     }

//     // Create event record
//     const eventRecord = {
//       id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
//       userId,
//       anonymousId,
//       event,
//       properties: properties || {},
//       timestamp: timestamp || Date.now(),
//       createdAt: new Date().toISOString(),
//     };

//     // Store event
//     const userEvents = events.get(userId || anonymousId) || [];
//     userEvents.push(eventRecord);
//     events.set(userId || anonymousId, userEvents);

//     console.log("📊 Event tracked:", {
//       event,
//       userId: userId || anonymousId,
//       properties,
//       timestamp: new Date(eventRecord.timestamp).toISOString(),
//     });

//     // Check for matching campaigns (workflow trigger simulation)
//     const matchedCampaigns = Array.from(campaigns.values()).filter(
//       (campaign) => campaign.active && campaign.trigger === event
//     );

//     if (matchedCampaigns.length > 0) {
//       console.log(
//         "🎯 Triggered campaigns:",
//         matchedCampaigns.map((c) => c.name)
//       );

//       matchedCampaigns.forEach((campaign) => {
//         console.log(`  → Campaign: ${campaign.name}`);
//         console.log(`  → Would send email to user: ${userId || anonymousId}`);
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       eventId: eventRecord.id,
//       message: "Event tracked successfully",
//       triggeredCampaigns: matchedCampaigns.map((c) => c.name),
//     });
//   } catch (error) {
//     console.error("❌ Track error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

// In-memory storage for testing
const events = new Map<string, any[]>();
const campaigns = new Map<string, any>();

// Sample campaigns for testing workflow triggers
const sampleCampaigns = [
  {
    id: "welcome-email",
    name: "Welcome Email",
    trigger: "signed_up",
    active: true,
    filter: { plan: "trial" },
  },
  {
    id: "cart-abandonment",
    name: "Cart Abandonment",
    trigger: "item_added_to_cart",
    active: true,
    filter: {},
  },
  {
    id: "trial-ending",
    name: "Trial Ending Soon",
    trigger: "trial_ending_soon",
    active: true,
    filter: { days_remaining: 3 },
  },
];

// Initialize sample campaigns
sampleCampaigns.forEach((campaign) => {
  campaigns.set(campaign.id, campaign);
});

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    // const apiKey = request.headers.get("X-API-Key");
    // if (!apiKey || apiKey !== process.env.ANALYTICS_API_KEY) {
    //   return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    // }

    const body = await request.json();
    const { userId, event, properties, timestamp, anonymousId } = body;

    // Validate required fields
    if (!event) {
      return NextResponse.json({ error: "event is required" }, { status: 400 });
    }

    if (!userId && !anonymousId) {
      return NextResponse.json(
        { error: "userId or anonymousId is required" },
        { status: 400 }
      );
    }

    // Create event record
    const eventRecord = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      anonymousId,
      event,
      properties: properties || {},
      timestamp: timestamp || Date.now(),
      createdAt: new Date().toISOString(),
    };

    // Store event
    const userEvents = events.get(userId || anonymousId) || [];
    userEvents.push(eventRecord);
    events.set(userId || anonymousId, userEvents);

    console.log("📊 Event tracked:", {
      event,
      userId: userId || anonymousId,
      properties,
      timestamp: new Date(eventRecord.timestamp).toISOString(),
    });

    // Check for matching campaigns (workflow trigger simulation)
    const matchedCampaigns = Array.from(campaigns.values()).filter(
      (campaign) => campaign.active && campaign.trigger === event
    );

    if (matchedCampaigns.length > 0) {
      console.log(
        "🎯 Triggered campaigns:",
        matchedCampaigns.map((c) => c.name)
      );

      matchedCampaigns.forEach((campaign) => {
        console.log(`  → Campaign: ${campaign.name}`);
        console.log(`  → Would send email to user: ${userId || anonymousId}`);
      });
    }

    return NextResponse.json({
      success: true,
      eventId: eventRecord.id,
      message: "Event tracked successfully",
      triggeredCampaigns: matchedCampaigns.map((c) => c.name),
    });
  } catch (error) {
    console.error("❌ Track error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
