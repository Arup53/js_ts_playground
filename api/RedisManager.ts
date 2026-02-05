import { createClient, type RedisClientType } from "redis";

export class RedisManager {
  private publisher: RedisClientType;
  private static instance: RedisManager;
  private static connecting: Promise<void>;
  private constructor() {
    this.publisher = createClient({
      url: process.env.REDIS_URL,
    });
    RedisManager.connecting = this.publisher.connect();
  }

  public static async getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }

    // ensure redis is fully connected
    await RedisManager.connecting;
    return this.instance;
  }

  public async addEventInQueue(event: any) {
    try {
      const size = await this.publisher.lPush(
        "event_queue",
        JSON.stringify(event)
      );
      return size;
    } catch (err) {
      console.error("Redis LPUSH failed:", err);
      throw err;
    }
  }
}
