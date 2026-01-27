"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { AnalyticsClient, initializeAnalytics } from "@/lib/analytics/client";

const AnalyticsContext = createContext<AnalyticsClient | null>(null);

export function AnalyticsProvider({
  children,
  apiKey,
}: {
  children: ReactNode;
  apiKey: string;
}) {
  const analytics = initializeAnalytics(apiKey);

  useEffect(() => {
    // Auto-track page views on route changes
    analytics.page();

    // Flush pending requests before page unload
    const handleBeforeUnload = () => {
      // Use sendBeacon for guaranteed delivery on page unload
      const status = analytics.getQueueStatus();
      if (status.queued > 0 || status.pending > 0) {
        // Attempt to flush (best effort)
        analytics.flush().catch(() => {
          // Silently fail - user is leaving anyway
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [analytics]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsClient {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }

  return context;
}
