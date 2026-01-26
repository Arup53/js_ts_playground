"use client";

import analytics from "@/lib/analytics";

export default function UpgradeButton() {
  const handleUpgrade = () => {
    analytics.event("upgrade_click", {
      plan: "pro",
      price: 29.99,
      location: "pricing_page",
    });

    // normal button submission logic not related to analytics
    window.location.href = "/checkout";
  };

  return <button onClick={handleUpgrade}>Upgrade to Pro</button>;
}
