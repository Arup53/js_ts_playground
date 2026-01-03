import request from "supertest";
import app from "./app";
import { rateLimiter } from "./rate_limiter";

// Mock the rate limiter middleware
jest.mock("./rate_limiter", () => ({
  rateLimiter: jest.fn((req, res, next) => next()),
}));

describe("GET /", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and a hello message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello" });
  });

  it("should call the rate limiter middleware", async () => {
    await request(app).get("/");

    expect(rateLimiter).toHaveBeenCalled();
  });

  it("should return JSON content type", async () => {
    const response = await request(app).get("/");

    expect(response.headers["content-type"]).toMatch(/json/);
  });
});

describe("Rate Limiter Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block requests when rate limit is exceeded", async () => {
    // Mock rate limiter to simulate rate limiting
    (rateLimiter as jest.Mock).mockImplementationOnce((req, res, next) => {
      res.status(429).json({ error: "Too many requests" });
    });

    const response = await request(app).get("/");

    expect(response.status).toBe(429);
    expect(response.body).toEqual({ error: "Too many requests" });
  });
});
