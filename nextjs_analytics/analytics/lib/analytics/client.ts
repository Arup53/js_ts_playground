// type UserAttributes = {
//   email?: string;
//   name?: string;
//   [key: string]: any;
// };

// type EventProperties = {
//   [key: string]: any;
// };

// class AnalyticsClient {
//   private apiKey: string;
//   private apiUrl: string;
//   private userId: string | null = null;
//   private anonymousId: string | null = null;
//   private pendingRequests: Set<Promise<void>> = new Set();
//   private maxConcurrentRequests = 6; // Browser typically allows 6 concurrent requests per domain
//   private requestQueue: Array<() => Promise<void>> = [];

//   constructor(
//     apiKey: string,
//     options: { apiUrl?: string; maxConcurrent?: number } = {}
//   ) {
//     this.apiKey = process.env.NEXT_PUBLIC_ANALYTICS_API_KEY!;
//     this.apiUrl =
//       options.apiUrl ||
//       process.env.NEXT_PUBLIC_ANALYTICS_API_URL ||
//       "http://localhost:3000/api/analytics";
//     this.maxConcurrentRequests = options.maxConcurrent || 6;

//     // Get or create anonymous ID
//     if (typeof window !== "undefined") {
//       this.anonymousId = this.getOrCreateAnonymousId();
//     }
//   }

//   private getOrCreateAnonymousId(): string {
//     const key = "_analytics_anonymous_id";
//     let id = localStorage.getItem(key);

//     if (!id) {
//       id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
//       localStorage.setItem(key, id);
//     }

//     return id;
//   }

//   private async sendRequest(endpoint: string, data: any): Promise<void> {
//     try {
//       const response = await fetch(`${this.apiUrl}${endpoint}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-Key": this.apiKey,
//         },
//         body: JSON.stringify({
//           ...data,
//           timestamp: data.timestamp || Date.now(),
//           anonymousId: this.anonymousId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`API request failed: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Analytics error:", error);
//       // Silently fail - don't break user experience
//     }
//   }

//   /**
//    * Process requests with concurrency control
//    * Ensures we don't overwhelm the browser or server
//    */
//   private async processRequests(): Promise<void> {
//     while (
//       this.requestQueue.length > 0 &&
//       this.pendingRequests.size < this.maxConcurrentRequests
//     ) {
//       const task = this.requestQueue.shift();
//       if (!task) continue;

//       // Start the request (non-blocking)
//       const promise = task().finally(() => {
//         // Remove from pending set when done
//         this.pendingRequests.delete(promise);
//         // Process more requests if queue has items
//         if (this.requestQueue.length > 0) {
//           this.processRequests();
//         }
//       });

//       // Track this pending request
//       this.pendingRequests.add(promise);
//     }
//   }

//   /**
//    * Enqueue a request - COMPLETELY NON-BLOCKING
//    * Returns immediately, request happens in background
//    */
//   private enqueue(task: () => Promise<void>): void {
//     this.requestQueue.push(task);
//     // Fire and forget - don't await
//     this.processRequests();
//   }

//   /**
//    * Identify a user and set their attributes
//    */
//   identify(userId: string, attributes: UserAttributes = {}): void {
//     this.userId = userId;

//     this.enqueue(async () => {
//       await this.sendRequest("/identify", {
//         userId,
//         attributes,
//       });
//     });
//   }

//   /**
//    * Track an event
//    */
//   track(eventName: string, properties: EventProperties = {}): void {
//     if (!this.userId && !this.anonymousId) {
//       console.warn(
//         "No user identified. Call identify() first or track will use anonymous ID."
//       );
//     }

//     this.enqueue(async () => {
//       await this.sendRequest("/track", {
//         userId: this.userId,
//         event: eventName,
//         properties,
//       });
//     });
//   }

//   /**
//    * Update user attributes without changing userId
//    */
//   updateAttributes(attributes: UserAttributes): void {
//     if (!this.userId) {
//       console.warn("No user identified. Call identify() first.");
//       return;
//     }

//     this.enqueue(async () => {
//       await this.sendRequest("/identify", {
//         userId: this.userId,
//         attributes,
//       });
//     });
//   }

//   /**
//    * Track a page view
//    */
//   page(pageName?: string, properties: EventProperties = {}): void {
//     this.track("page_viewed", {
//       page_name:
//         pageName ||
//         (typeof window !== "undefined" ? window.location.pathname : "unknown"),
//       page_url:
//         typeof window !== "undefined" ? window.location.href : undefined,
//       ...properties,
//     });
//   }

//   /**
//    * Reset user identity (logout)
//    */
//   reset(): void {
//     this.userId = null;
//     // Keep anonymous ID for tracking
//   }

//   /**
//    * Get current user ID
//    */
//   getUserId(): string | null {
//     return this.userId;
//   }

//   /**
//    * Flush all pending requests (useful for page unload)
//    * Returns a promise that resolves when all requests complete
//    */
//   async flush(): Promise<void> {
//     // Process all queued items
//     while (this.requestQueue.length > 0) {
//       await this.processRequests();
//     }

//     // Wait for all pending requests to complete
//     if (this.pendingRequests.size > 0) {
//       await Promise.all(Array.from(this.pendingRequests));
//     }
//   }

//   /**
//    * Get queue status (for debugging)
//    */
//   getQueueStatus(): { queued: number; pending: number } {
//     return {
//       queued: this.requestQueue.length,
//       pending: this.pendingRequests.size,
//     };
//   }
// }

// // Singleton instance
// let analyticsInstance: AnalyticsClient | null = null;

// export function initializeAnalytics(
//   apiKey: string,
//   options?: { apiUrl?: string }
// ): AnalyticsClient {
//   if (!analyticsInstance) {
//     analyticsInstance = new AnalyticsClient(apiKey, options);
//   }
//   return analyticsInstance;
// }

// export function getAnalytics(): AnalyticsClient {
//   if (!analyticsInstance) {
//     throw new Error(
//       "Analytics not initialized. Call initializeAnalytics() first."
//     );
//   }
//   return analyticsInstance;
// }

// export { AnalyticsClient };

// // ============================================
// // FILE: /lib/analytics/server.ts
// // Server-side SDK (runs in Next.js API routes & server components)
// // ============================================

// type ServerEventData = {
//   userId: string;
//   event: string;
//   properties?: Record<string, any>;
//   timestamp?: number;
// };

// type ServerIdentifyData = {
//   userId: string;
//   attributes: Record<string, any>;
// };

// class AnalyticsServer {
//   private apiKey: string;
//   private apiUrl: string;

//   constructor(apiKey: string, options: { apiUrl?: string } = {}) {
//     this.apiKey = apiKey;
//     this.apiUrl =
//       options.apiUrl ||
//       process.env.ANALYTICS_API_URL ||
//       "http://localhost:3000/api/analytics";
//   }

//   private async sendRequest(endpoint: string, data: any): Promise<void> {
//     try {
//       const response = await fetch(`${this.apiUrl}${endpoint}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-Key": this.apiKey,
//         },
//         body: JSON.stringify({
//           ...data,
//           timestamp: data.timestamp || Date.now(),
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `API request failed: ${response.statusText} - ${errorText}`
//         );
//       }
//     } catch (error) {
//       console.error("Server analytics error:", error);
//       throw error; // On server, we want to know about failures
//     }
//   }

//   /**
//    * Identify a user (server-side)
//    */
//   async identify(data: ServerIdentifyData): Promise<void> {
//     await this.sendRequest("/identify", {
//       userId: data.userId,
//       attributes: data.attributes,
//     });
//   }

//   /**
//    * Track an event (server-side)
//    */
//   async track(data: ServerEventData): Promise<void> {
//     await this.sendRequest("/track", {
//       userId: data.userId,
//       event: data.event,
//       properties: data.properties || {},
//       timestamp: data.timestamp,
//     });
//   }

//   /**
//    * Track multiple events in batch
//    */
//   async trackBatch(events: ServerEventData[]): Promise<void> {
//     await this.sendRequest("/track/batch", {
//       events: events.map((event) => ({
//         userId: event.userId,
//         event: event.event,
//         properties: event.properties || {},
//         timestamp: event.timestamp || Date.now(),
//       })),
//     });
//   }
// }

// export function createServerAnalytics(apiKey?: string): AnalyticsServer {
//   const key = apiKey || process.env.ANALYTICS_API_KEY;

//   if (!key) {
//     throw new Error(
//       "Analytics API key not provided. Set ANALYTICS_API_KEY environment variable."
//     );
//   }

//   return new AnalyticsServer(key);
// }

// export { AnalyticsServer };
type UserAttributes = {
  email?: string;
  name?: string;
  [key: string]: any;
};

type EventProperties = {
  [key: string]: any;
};

type QueuedEvent = {
  type: "track" | "identify";
  data: any;
  timestamp: number;
};

class AnalyticsClient {
  private apiKey: string;
  private apiUrl: string;
  private userId: string | null = null;
  private anonymousId: string | null = null;
  private eventQueue: QueuedEvent[] = [];

  // Batching configuration
  private BATCH_SIZE_THRESHOLD = 10; // Send when queue reaches 10 items
  private FLUSH_INTERVAL = 5000; // Flush every 5 seconds
  private MAX_QUEUE_SIZE = 100; // Maximum queue size before forcing flush

  private flushTimer: NodeJS.Timeout | null = null;
  private isFlushing = false;

  constructor(
    apiKey: string,
    options: {
      apiUrl?: string;
      batchSize?: number;
      flushInterval?: number;
    } = {}
  ) {
    this.apiKey = apiKey;
    this.apiUrl =
      options.apiUrl ||
      process.env.NEXT_PUBLIC_ANALYTICS_API_URL ||
      "http://localhost:3000/api/analytics";

    if (options.batchSize) this.BATCH_SIZE_THRESHOLD = options.batchSize!;
    if (options.flushInterval) this.FLUSH_INTERVAL = options.flushInterval!;

    // Get or create anonymous ID
    if (typeof window !== "undefined") {
      this.anonymousId = this.getOrCreateAnonymousId();
      this.setupAutoFlush();
      this.setupPageListeners();
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

  /**
   * Setup automatic flush timer
   */
  private setupAutoFlush(): void {
    // Clear existing timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Start new timer - flush every N seconds
    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        console.log(
          `[Analytics] Auto-flush triggered (timer: ${this.FLUSH_INTERVAL}ms)`
        );
        this.flush();
      }
    }, this.FLUSH_INTERVAL);
  }

  /**
   * Setup page lifecycle listeners
   */
  private setupPageListeners(): void {
    // Flush on page visibility change (tab hidden)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.eventQueue.length > 0) {
        console.log("[Analytics] Page hidden - flushing queue");
        this.flush();
      }
    });

    // Flush before page unload
    window.addEventListener("beforeunload", () => {
      if (this.eventQueue.length > 0) {
        console.log("[Analytics] Page unload - flushing queue");
        this.flushSync(); // Use synchronous flush for unload
      }
    });

    // Flush when browser becomes idle (optional)
    if ("requestIdleCallback" in window) {
      const scheduleIdleFlush = () => {
        requestIdleCallback(() => {
          if (this.eventQueue.length > 0) {
            console.log("[Analytics] Browser idle - flushing queue");
            this.flush();
          }
          // Schedule next idle check
          setTimeout(scheduleIdleFlush, 10000); // Check every 10 seconds
        });
      };
      scheduleIdleFlush();
    }
  }

  /**
   * Add event to queue and check if flush needed
   */
  private enqueue(event: QueuedEvent): void {
    this.eventQueue.push(event);

    console.log(
      `[Analytics] Event queued: ${event.type} (queue size: ${this.eventQueue.length}/${this.BATCH_SIZE_THRESHOLD})`
    );

    // Check if we should flush based on thresholds
    if (this.eventQueue.length >= this.BATCH_SIZE_THRESHOLD) {
      console.log("[Analytics] Batch size threshold reached - flushing queue");
      this.flush();
    } else if (this.eventQueue.length >= this.MAX_QUEUE_SIZE) {
      console.log("[Analytics] MAX queue size reached - forcing flush");
      this.flush();
    }
  }

  /**
   * Flush queue asynchronously (normal flush)
   */
  async flush(): Promise<void> {
    if (this.isFlushing || this.eventQueue.length === 0) {
      return;
    }

    this.isFlushing = true;

    // Get all queued events
    const eventsToSend = [...this.eventQueue];
    this.eventQueue = []; // Clear queue immediately

    console.log(`[Analytics] Flushing ${eventsToSend.length} events to API...`);

    try {
      // Separate identify and track events
      const identifyEvents = eventsToSend.filter((e) => e.type === "identify");
      const trackEvents = eventsToSend.filter((e) => e.type === "track");

      // Send identify events first (important for user context)
      for (const event of identifyEvents) {
        await this.sendRequest("/identify", event.data);
      }

      // Send track events in batch
      if (trackEvents.length > 0) {
        await this.sendBatchRequest(
          "/track/batch",
          trackEvents.map((e) => e.data)
        );
      }

      console.log(
        `[Analytics] ✅ Successfully flushed ${eventsToSend.length} events`
      );
    } catch (error) {
      console.error("[Analytics] ❌ Flush failed:", error);
      // Re-add failed events to queue (at the front)
      this.eventQueue = [...eventsToSend, ...this.eventQueue];
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Synchronous flush for page unload (uses sendBeacon)
   */
  private flushSync(): void {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    console.log(`[Analytics] Sync flush: ${eventsToSend.length} events`);

    // Try sendBeacon first (guaranteed delivery on page unload)
    if (navigator.sendBeacon) {
      const trackEvents = eventsToSend.filter((e) => e.type === "track");

      if (trackEvents.length > 0) {
        const blob = new Blob(
          [
            JSON.stringify({
              events: trackEvents.map((e) => ({
                ...e.data,
                timestamp: e.timestamp,
              })),
            }),
          ],
          { type: "application/json" }
        );

        const sent = navigator.sendBeacon(`${this.apiUrl}/track/batch`, blob);
        console.log(`[Analytics] SendBeacon ${sent ? "succeeded" : "failed"}`);
      }
    }
  }

  /**
   * Send single request
   */
  private async sendRequest(endpoint: string, data: any): Promise<void> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify({
        ...data,
        anonymousId: this.anonymousId,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
  }

  /**
   * Send batch request
   */
  private async sendBatchRequest(
    endpoint: string,
    events: any[]
  ): Promise<void> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify({ events }),
    });

    if (!response.ok) {
      throw new Error(`Batch request failed: ${response.statusText}`);
    }
  }

  /**
   * Identify a user - QUEUED, not sent immediately
   */
  identify(userId: string, attributes: UserAttributes = {}): void {
    this.userId = userId;

    this.enqueue({
      type: "identify",
      data: {
        userId,
        attributes,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Track an event - QUEUED, not sent immediately
   */
  track(eventName: string, properties: EventProperties = {}): void {
    if (!this.userId && !this.anonymousId) {
      console.warn(
        "[Analytics] No user identified. Call identify() first or track will use anonymous ID."
      );
    }

    this.enqueue({
      type: "track",
      data: {
        userId: this.userId,
        event: eventName,
        properties,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Update user attributes without changing userId
   */
  updateAttributes(attributes: UserAttributes): void {
    if (!this.userId) {
      console.warn("[Analytics] No user identified. Call identify() first.");
      return;
    }

    this.enqueue({
      type: "identify",
      data: {
        userId: this.userId,
        attributes,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
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
    // Flush any pending events before reset
    this.flush();
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * Get queue status (for debugging)
   */
  getQueueStatus(): {
    queued: number;
    isFlushing: boolean;
    batchThreshold: number;
  } {
    return {
      queued: this.eventQueue.length,
      isFlushing: this.isFlushing,
      batchThreshold: this.BATCH_SIZE_THRESHOLD,
    };
  }

  /**
   * Manual flush (for testing or special cases)
   */
  async manualFlush(): Promise<void> {
    console.log("[Analytics] Manual flush requested");
    await this.flush();
  }

  /**
   * Destroy instance and cleanup
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    // Final flush before destroy
    this.flushSync();
  }
}

// Singleton instance
let analyticsInstance: AnalyticsClient | null = null;

export function initializeAnalytics(
  apiKey: string,
  options?: { apiUrl?: string; batchSize?: number; flushInterval?: number }
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
