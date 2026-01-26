"use client";

import { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import analytics from "@/app/lib";

export default function AnalyticsInitializer() {
  useEffect(() => {
    analytics.init();

    return () => {};
  }, []);

  // This component renders nothing
  return null;
}
