// "use client";

// import { useAnalytics } from "../providers/AnalyticsProvider";
// import { useState } from "react";

// export default function TestAnalyticsPage() {
//   const analytics = useAnalytics();
//   const [userId, setUserId] = useState("test_user_123");
//   const [eventName, setEventName] = useState("button_clicked");
//   const [results, setResults] = useState<any[]>([]);

//   const addResult = (message: string, data?: any) => {
//     setResults((prev) => [
//       {
//         time: new Date().toISOString(),
//         message,
//         data,
//       },
//       ...prev,
//     ]);
//   };

//   const handleIdentify = () => {
//     analytics.identify(userId, {
//       email: `${userId}@example.com`,
//       name: "Test User",
//       plan: "trial",
//       signupDate: new Date().toISOString(),
//     });
//     addResult("✅ User identified", { userId });
//   };

//   const handleTrackEvent = () => {
//     analytics.track(eventName, {
//       source: "test_page",
//       timestamp: Date.now(),
//     });
//     addResult("📊 Event tracked", { event: eventName });
//   };

//   const handleSignupFlow = () => {
//     const newUserId = `user_${Date.now()}`;

//     // Simulate signup flow
//     analytics.identify(newUserId, {
//       email: `${newUserId}@example.com`,
//       name: "New User",
//       plan: "trial",
//     });
//     addResult("1. User identified", { userId: newUserId });

//     setTimeout(() => {
//       analytics.track("signed_up", {
//         source: "landing_page",
//         plan: "trial",
//       });
//       addResult(
//         '2. Signup event tracked - Should trigger "Welcome Email" campaign'
//       );
//     }, 100);

//     setTimeout(() => {
//       analytics.track("profile_completed", {
//         fields: ["name", "email", "company"],
//       });
//       addResult("3. Profile completed");
//     }, 500);
//   };

//   const handleCartFlow = () => {
//     analytics.track("item_added_to_cart", {
//       product_id: "prod_123",
//       product_name: "Premium Plan",
//       price: 99.99,
//       cart_value: 99.99,
//     });
//     addResult(
//       '🛒 Item added to cart - Should trigger "Cart Abandonment" campaign'
//     );
//   };

//   const handleTrialFlow = () => {
//     analytics.track("trial_ending_soon", {
//       days_remaining: 3,
//       trial_end_date: new Date(
//         Date.now() + 3 * 24 * 60 * 60 * 1000
//       ).toISOString(),
//     });
//     addResult(
//       '⏰ Trial ending event - Should trigger "Trial Ending Soon" campaign'
//     );
//   };

//   const handleRapidFire = () => {
//     // Test concurrent requests
//     for (let i = 1; i <= 10; i++) {
//       analytics.track(`rapid_event_${i}`, {
//         sequence: i,
//         timestamp: Date.now(),
//       });
//     }
//     addResult("🚀 Fired 10 events rapidly - Testing concurrent processing");

//     setTimeout(() => {
//       const status = analytics.getQueueStatus();
//       addResult("Queue status", status);
//     }, 100);
//   };

//   const checkDebugData = async () => {
//     try {
//       const response = await fetch("/api/analytics/debug");
//       const data = await response.json();
//       addResult("📋 Debug data fetched", data);
//     } catch (error) {
//       addResult("❌ Error fetching debug data", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50  p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">Analytics SDK Test Page</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Controls */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">SDK Controls</h2>

//             <div className="space-y-4">
//               {/* Identify */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   User ID
//                 </label>
//                 <input
//                   type="text"
//                   value={userId}
//                   onChange={(e) => setUserId(e.target.value)}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//                 <button
//                   onClick={handleIdentify}
//                   className="mt-2 w-full bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   Identify User
//                 </button>
//               </div>

//               {/* Track Event */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Event Name
//                 </label>
//                 <input
//                   type="text"
//                   value={eventName}
//                   onChange={(e) => setEventName(e.target.value)}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//                 <button
//                   onClick={handleTrackEvent}
//                   className="mt-2 w-full bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
//                 >
//                   Track Event
//                 </button>
//               </div>

//               <hr className="my-4" />

//               {/* Pre-built Flows */}
//               <div className="space-y-2">
//                 <h3 className="font-semibold">Test Workflows</h3>

//                 <button
//                   onClick={handleSignupFlow}
//                   className="w-full bg-purple-500 text-black px-4 py-2 rounded hover:bg-purple-600"
//                 >
//                   🎉 Simulate Signup Flow
//                 </button>

//                 <button
//                   onClick={handleCartFlow}
//                   className="w-full bg-orange-500 text-black px-4 py-2 rounded hover:bg-orange-600"
//                 >
//                   🛒 Simulate Cart Abandonment
//                 </button>

//                 <button
//                   onClick={handleTrialFlow}
//                   className="w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
//                 >
//                   ⏰ Simulate Trial Ending
//                 </button>

//                 <button
//                   onClick={handleRapidFire}
//                   className="w-full bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
//                 >
//                   🚀 Rapid Fire (10 events)
//                 </button>

//                 <button
//                   onClick={checkDebugData}
//                   className="w-full bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   📋 Check Debug Data
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Results */}
//           <div className="bg-white rounded-lg shadow p-6 text-black">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Activity Log</h2>
//               <button
//                 onClick={() => setResults([])}
//                 className="text-sm text-gray-500 hover:text-gray-700"
//               >
//                 Clear
//               </button>
//             </div>

//             <div className="space-y-2 max-h-[600px] overflow-y-auto">
//               {results.length === 0 && (
//                 <p className="text-black text-sm">No activity yet...</p>
//               )}

//               {results.map((result, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-50 rounded p-3 text-sm border border-gray-200"
//                 >
//                   <div className="flex justify-between items-start mb-1">
//                     <span className="font-medium">{result.message}</span>
//                     <span className="text-xs text-gray-500">
//                       {new Date(result.time).toLocaleTimeString()}
//                     </span>
//                   </div>
//                   {result.data && (
//                     <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto">
//                       {JSON.stringify(result.data, null, 2)}
//                     </pre>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
//           <h3 className="font-semibold mb-2">📖 How to Test</h3>
//           <ol className="list-decimal list-inside space-y-1 text-sm">
//             <li>Open your browser's Network tab to see API requests</li>
//             <li>Open the terminal to see server-side logs</li>
//             <li>
//               Click "Simulate Signup Flow" to trigger the welcome campaign
//             </li>
//             <li>Watch the Activity Log for results</li>
//             <li>Check server logs for campaign triggers</li>
//             <li>Use "Check Debug Data" to view all stored events</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useAnalytics } from "../providers/AnalyticsProvider";
import { useState } from "react";

export default function TestAnalyticsPage() {
  const analytics = useAnalytics();
  const [userId, setUserId] = useState("test_user_123");
  const [eventName, setEventName] = useState("button_clicked");
  const [results, setResults] = useState<any[]>([]);

  const addResult = (message: string, data?: any) => {
    setResults((prev) => [
      {
        time: new Date().toISOString(),
        message,
        data,
      },
      ...prev,
    ]);
  };

  const handleIdentify = () => {
    analytics.identify(userId, {
      email: `${userId}@example.com`,
      name: "Test User",
      plan: "trial",
      signupDate: new Date().toISOString(),
    });
    addResult("✅ User identified", { userId });
  };

  const handleTrackEvent = () => {
    analytics.track(eventName, {
      source: "test_page",
      timestamp: Date.now(),
    });
    addResult("📊 Event tracked", { event: eventName });
  };

  const handleSignupFlow = () => {
    const newUserId = `user_${Date.now()}`;

    // Simulate signup flow
    analytics.identify(newUserId, {
      email: `${newUserId}@example.com`,
      name: "New User",
      plan: "trial",
    });
    addResult("1. User identified", { userId: newUserId });

    setTimeout(() => {
      analytics.track("signed_up", {
        source: "landing_page",
        plan: "trial",
      });
      addResult(
        '2. Signup event tracked - Should trigger "Welcome Email" campaign'
      );
    }, 100);

    setTimeout(() => {
      analytics.track("profile_completed", {
        fields: ["name", "email", "company"],
      });
      addResult("3. Profile completed");
    }, 500);
  };

  const handleCartFlow = () => {
    analytics.track("item_added_to_cart", {
      product_id: "prod_123",
      product_name: "Premium Plan",
      price: 99.99,
      cart_value: 99.99,
    });
    addResult(
      '🛒 Item added to cart - Should trigger "Cart Abandonment" campaign'
    );
  };

  const handleTrialFlow = () => {
    analytics.track("trial_ending_soon", {
      days_remaining: 3,
      trial_end_date: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
    addResult(
      '⏰ Trial ending event - Should trigger "Trial Ending Soon" campaign'
    );
  };

  const handleRapidFire = () => {
    // Test concurrent requests
    for (let i = 1; i <= 10; i++) {
      analytics.track(`rapid_event_${i}`, {
        sequence: i,
        timestamp: Date.now(),
      });
    }
    addResult("🚀 Fired 10 events rapidly - Testing concurrent processing");

    setTimeout(() => {
      const status = analytics.getQueueStatus();
      addResult("Queue status", status);
    }, 100);
  };

  const checkDebugData = async () => {
    try {
      const response = await fetch("/api/analytics/debug");
      const data = await response.json();
      addResult("📋 Debug data fetched", data);
    } catch (error) {
      addResult("❌ Error fetching debug data", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics SDK Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">SDK Controls</h2>

            <div className="space-y-4">
              {/* Identify */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <button
                  onClick={handleIdentify}
                  className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Identify User
                </button>
              </div>

              {/* Track Event */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <button
                  onClick={handleTrackEvent}
                  className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Track Event
                </button>
              </div>

              <hr className="my-4" />

              {/* Pre-built Flows */}
              <div className="space-y-2">
                <h3 className="font-semibold">Test Workflows</h3>

                <button
                  onClick={handleSignupFlow}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  🎉 Simulate Signup Flow
                </button>

                <button
                  onClick={handleCartFlow}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  🛒 Simulate Cart Abandonment
                </button>

                <button
                  onClick={handleTrialFlow}
                  className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  ⏰ Simulate Trial Ending
                </button>

                <button
                  onClick={handleRapidFire}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  🚀 Rapid Fire (10 events)
                </button>

                <button
                  onClick={checkDebugData}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  📋 Check Debug Data
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Activity Log</h2>
              <button
                onClick={() => setResults([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {results.length === 0 && (
                <p className="text-gray-400 text-sm">No activity yet...</p>
              )}

              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded p-3 text-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{result.message}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.time).toLocaleTimeString()}
                    </span>
                  </div>
                  {result.data && (
                    <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">📖 How to Test</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open your browser's Network tab to see API requests</li>
            <li>Open the terminal to see server-side logs</li>
            <li>
              Click "Simulate Signup Flow" to trigger the welcome campaign
            </li>
            <li>Watch the Activity Log for results</li>
            <li>Check server logs for campaign triggers</li>
            <li>Use "Check Debug Data" to view all stored events</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
