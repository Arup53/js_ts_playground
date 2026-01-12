import request from "supertest";
import app from "./app";
import Redis from "ioredis";

// Create a Redis client for testing
const redis = new Redis();

describe("GET / - Integration Tests", () => {
  beforeEach(async () => {
    // Clear Redis before each test
    await redis.flushall();
  });

  afterAll(async () => {
    // Clean up Redis connection
    await redis.quit();
  });

  it("should return 200 and a hello message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello" });
  });

  it("should allow requests within rate limit", async () => {
    // Make 5 requests (within limit)
    for (let i = 0; i < 5; i++) {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
    }
  });

  it("should block requests when rate limit is exceeded", async () => {
    // Make 5 successful requests
    for (let i = 0; i < 5; i++) {
      await request(app).get("/");
    }

    // 6th request should be rate limited
    const response = await request(app).get("/");
    expect(response.status).toBe(429);
    expect(response.body).toEqual({ error: "Too Many Requests" });
  });

  it("should reset rate limit after window expires", async () => {
    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      await request(app).get("/");
    }

    // Wait for window to expire (61 seconds)
    await new Promise((resolve) => setTimeout(resolve, 61000));

    // Should allow requests again
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  }, 65000); // Increase Jest timeout for this test
});

describe("GET / - Unit Tests (Mocked)", () => {
  // For unit tests, you can still mock Redis
  let mockRedis: any;

  beforeEach(() => {
    mockRedis = {
      incr: jest.fn(),
      expire: jest.fn(),
    };
  });

  it("should return JSON content type", async () => {
    const response = await request(app).get("/");
    expect(response.headers["content-type"]).toMatch(/json/);
  });
});
