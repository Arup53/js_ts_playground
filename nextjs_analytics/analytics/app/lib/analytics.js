class Analytics {
  constructor() {
    this.userId = null;
    this.sessionId = null;
    this.endpoint = "/api/track";
    this.isIntialized = false;

    this.queue = [];
  }

  init() {
    // Guard against server-side execution
    if (typeof window === "undefined") {
      console.warn("Analytics can only be initialized in the browser");
      return;
    }

    // Guard against double initialization
    if (this.isInitialized) {
      console.warn("Analytics already initialized");
      return;
    }

    this.userId = this.getUserId();
    this.sessionId = this.getSessionId();
    this.setupEventListner();
    this.trackPageView();
    this.processQueue();

    this.isInitialized = true;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  getUserId() {
    let userId = localStorage.getItem("analytics_user_id");

    if (!userId) {
      userId = this.generateId();
      localStorage.setItem("analytics_user_id", userId);
    }
    return userId;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem(sessionId);
    }
    return sessionId;
  }

  send(event) {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(event)], {
        type: "application/json",
      });
      navigator.sendBeacon(this.endpoint, blob);
    } else {
      fetch(this.endpoint, {
        method: "POST",
        headers: "application/json",
        body: JSON.stringify(event),
        keepalive: true,
      }).catch((err) => console.log("Error in sending analytics", err));
    }
  }

  track(eventName, properties = {}) {
    if (!this.isInitialized) {
      this.queue.push({ eventName, properties });
      return;
    }

    const event = {
      eventName,
      properties,
      userId: this.userId,
      sessionId: this.sessionId,
      timeStamp: new Date().toISOString(),
      context: this.getContext,
    };

    this.send(event);
  }

  trackPageView() {
    this.track("pageview", {
      page: location.pathname,
      title: document.title,
      url: location.href,
    });
  }

  processQueue() {
    while (this.queue.length > 0) {
      const { eventName, properties } = this.queue.shift();
      this.track(eventName, properties);
    }
  }

  setupEventListner() {
    document.addEventListener("click", (e) => {
      const target = e.target.closest("a,button");
      if (target) {
        this.track("track", {
          element: target.tagName.toLowerCase(),
          text: target.textContent.trim().substring(0, 50),
        });
      }
    });

    let maxScroll = 0;
    let scrollTimeout;

    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
            100
        );

        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;

          // Track milestones
          if ([25, 50, 75, 100].includes(scrollPercent)) {
            this.track("scroll", { depth: scrollPercent });
          }
        }
      }, 100);
    });

    // Track visibility changes (tab focus/blur)
    document.addEventListener("visibilitychange", () => {
      this.track("visibility", {
        state: document.visibilityState,
        hidden: document.hidden,
      });
    });

    window.addEventListener("beforeunload", () => {
      const timeOnPage = performance.now();

      this.track("page_exit", {
        timeOnPage,
        scrollDepth: maxScroll,
      });
    });

    //  SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.trackPageView();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.trackPageView();
    };

    window.addEventListener("popstate", () => {
      this.trackPageView();
    });

    window.addEventListener("online", () => {
      this.track("connection", { status: "online" });
    });

    window.addEventListener("offline", () => {
      this.track("connection", { status: "offline" });
    });
  }

  identify(userId, traits = {}) {
    this.userId = userId;
    localStorage.setItem("analytics_user_id", userId);

    this.track("identify", traits);
  }

  event(eventName, properties = {}) {
    this.track(eventName, properties);
  }

  reset() {
    localStorage.removeItem("analytics_user_id");
    sessionStorage.removeItem("analytics_session_id");
    sessionStorage.removeItem("utm_params");

    this.userId = null;
    this.sessionId = null;
  }
}

const analytics = new Analytics();

export default analytics;
