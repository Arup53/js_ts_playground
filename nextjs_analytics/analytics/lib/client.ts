type UserAttributes = {
  email?: string;
  name?: string;
  [key: string]: any;
};

type EventProperties = {
  [key: string]: any;
};

class AnalyticsClient {
  private apiKey: string;
  private apiUrl: string;
  private userId: string | null = null;
  private anonymousId: string | null = null;
  private pendingRequests: Set<Promise<void>> = new Set();
  private maxConcurrentRequests = 6; // Browser typically allows 6 concurrent requests per domain
  private requestQueue: Array<() => Promise<void>> = [];

  constructor(
    apiKey: string,
    options: { apiUrl?: string; maxConcurrent?: number } = {}
  ) {
    this.apiKey = apiKey;
    this.apiUrl = options.apiUrl || "https://api.yourplatform.com";
    this.maxConcurrentRequests = options.maxConcurrent || 6;

    // Get or create anonymous ID
    if (typeof window !== "undefined") {
      this.anonymousId = this.getOrCreateAnonymousId();
    }
  }

  private getOrCreateAnonymousId(): string {
    const key = "_analytics_anonymous_id";
    let id = localStorage.getItem(key);

    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(key, id);
    }

    return id;
  }

  private async sendRequest(endpoint: string, data: any): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify({
          ...data,
          timestamp: data.timestamp || Date.now(),
          anonymousId: this.anonymousId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Analytics error:", error);
      // Silently fail - don't break user experience
    }
  }

  /**
   * Process requests with concurrency control
   * Ensures we don't overwhelm the browser or server
   */
  private async processRequests(): Promise<void> {
    while (
      this.requestQueue.length > 0 &&
      this.pendingRequests.size < this.maxConcurrentRequests
    ) {
      const task = this.requestQueue.shift();
      if (!task) continue;

      // Start the request (non-blocking)
      const promise = task().finally(() => {
        // Remove from pending set when done
        this.pendingRequests.delete(promise);
        // Process more requests if queue has items
        if (this.requestQueue.length > 0) {
          this.processRequests();
        }
      });

      // Track this pending request
      this.pendingRequests.add(promise);
    }
  }

  /**
   * Enqueue a request - COMPLETELY NON-BLOCKING
   * Returns immediately, request happens in background
   */
  private enqueue(task: () => Promise<void>): void {
    this.requestQueue.push(task);
    // Fire and forget - don't await
    this.processRequests();
  }

  /**
   * Identify a user and set their attributes
   */
  identify(userId: string, attributes: UserAttributes = {}): void {
    this.userId = userId;

    this.enqueue(async () => {
      await this.sendRequest("/identify", {
        userId,
        attributes,
      });
    });
  }

  /**
   * Track an event
   */
  track(eventName: string, properties: EventProperties = {}): void {
    if (!this.userId && !this.anonymousId) {
      console.warn(
        "No user identified. Call identify() first or track will use anonymous ID."
      );
    }

    this.enqueue(async () => {
      await this.sendRequest("/track", {
        userId: this.userId,
        event: eventName,
        properties,
      });
    });
  }

  /**
   * Update user attributes without changing userId
   */
  updateAttributes(attributes: UserAttributes): void {
    if (!this.userId) {
      console.warn("No user identified. Call identify() first.");
      return;
    }

    this.enqueue(async () => {
      await this.sendRequest("/identify", {
        userId: this.userId,
        attributes,
      });
    });
  }

  /**
   * Track a page view
   */
  page(pageName?: string, properties: EventProperties = {}): void {
    this.track("page_viewed", {
      page_name:
        pageName ||
        (typeof window !== "undefined" ? window.location.pathname : "unknown"),
      page_url:
        typeof window !== "undefined" ? window.location.href : undefined,
      ...properties,
    });
  }

  /**
   * Reset user identity (logout)
   */
  reset(): void {
    this.userId = null;
    // Keep anonymous ID for tracking
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * Flush all pending requests (useful for page unload)
   * Returns a promise that resolves when all requests complete
   */
  async flush(): Promise<void> {
    // Process all queued items
    while (this.requestQueue.length > 0) {
      await this.processRequests();
    }

    // Wait for all pending requests to complete
    if (this.pendingRequests.size > 0) {
      await Promise.all(Array.from(this.pendingRequests));
    }
  }

  /**
   * Get queue status (for debugging)
   */
  getQueueStatus(): { queued: number; pending: number } {
    return {
      queued: this.requestQueue.length,
      pending: this.pendingRequests.size,
    };
  }
}

// Singleton instance
let analyticsInstance: AnalyticsClient | null = null;

export function initializeAnalytics(
  apiKey: string,
  options?: { apiUrl?: string }
): AnalyticsClient {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsClient(apiKey, options);
  }
  return analyticsInstance;
}

export function getAnalytics(): AnalyticsClient {
  if (!analyticsInstance) {
    throw new Error(
      "Analytics not initialized. Call initializeAnalytics() first."
    );
  }
  return analyticsInstance;
}

export { AnalyticsClient };
