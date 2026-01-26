"use client";

import { useEffect } from "react";

import analytics from "@/lib/analytics";

export default function AnalyticsInitializer() {
  useEffect(() => {
    analytics.init();

    return () => {};
  }, []);

  // This component renders nothing
  return null;
}
