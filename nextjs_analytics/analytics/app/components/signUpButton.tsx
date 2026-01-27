"use client";

import { useAnalytics } from "../providers/AnalyticsProvider";

export function SignupButton() {
  const analytics = useAnalytics();

  const handleSignup = async () => {
    // Track the signup attempt
    analytics.track("signup_started", {
      source: "landing_page",
      plan: "pro",
    });

    // After successful signup
    const userId = "user_123";
    analytics.identify(userId, {
      email: "user@example.com",
      name: "John Doe",
      plan: "pro",
      signupDate: new Date().toISOString(),
    });

    analytics.track("signed_up", {
      plan: "pro",
    });
  };

  return <button onClick={handleSignup}>Sign Up</button>;
}
