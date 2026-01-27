// import { NextRequest, NextResponse } from "next/server";
// import { headers } from "next/headers";

// // In-memory storage for testing (use database in production)
// const users = new Map<string, any>();

// export async function POST(request: NextRequest) {
//   try {
//     // Verify API key
//     const apiKey = request.headers.get("X-API-Key");
//     // if (!apiKey || apiKey !== process.env.ANALYTICS_API_KEY) {
//     //   return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
//     // }

//     const body = await request.json();
//     const { userId, attributes, timestamp, anonymousId } = body;

//     // Validate required fields
//     if (!userId) {
//       return NextResponse.json(
//         { error: "userId is required" },
//         { status: 400 }
//       );
//     }

//     // Store or update user
//     const existingUser = users.get(userId) || {};
//     const updatedUser = {
//       ...existingUser,
//       userId,
//       attributes: {
//         ...existingUser.attributes,
//         ...attributes,
//       },
//       anonymousId: anonymousId || existingUser.anonymousId,
//       updatedAt: timestamp || Date.now(),
//       createdAt: existingUser.createdAt || timestamp || Date.now(),
//     };

//     users.set(userId, updatedUser);

//     console.log("✅ User identified:", {
//       userId,
//       attributes,
//       timestamp: new Date(timestamp || Date.now()).toISOString(),
//     });

//     return NextResponse.json({
//       success: true,
//       userId,
//       message: "User identified successfully",
//     });
//   } catch (error) {
//     console.error("❌ Identify error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// In-memory storage for testing (use database in production)
const users = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    // const apiKey = request.headers.get('X-API-Key');
    // if (!apiKey || apiKey !== process.env.ANALYTICS_API_KEY) {
    //   return NextResponse.json(
    //     { error: 'Invalid API key' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const { userId, attributes, timestamp, anonymousId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Store or update user
    const existingUser = users.get(userId) || {};
    const updatedUser = {
      ...existingUser,
      userId,
      attributes: {
        ...existingUser.attributes,
        ...attributes,
      },
      anonymousId: anonymousId || existingUser.anonymousId,
      updatedAt: timestamp || Date.now(),
      createdAt: existingUser.createdAt || timestamp || Date.now(),
    };

    users.set(userId, updatedUser);

    console.log("✅ User identified:", {
      userId,
      attributes,
      timestamp: new Date(timestamp || Date.now()).toISOString(),
    });

    return NextResponse.json({
      success: true,
      userId,
      message: "User identified successfully",
    });
  } catch (error) {
    console.error("❌ Identify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
