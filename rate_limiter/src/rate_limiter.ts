import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";

const redis = new Redis();

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = `rate:${req.ip}`;
  const limit = 5;
  const window = 60;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  if (current > limit) {
    return res.status(429).json({ error: "Too Many Requests" });
  }

  next();
};
