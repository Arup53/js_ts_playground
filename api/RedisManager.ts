import { createClient, type RedisClientType } from "redis";

export class RedisManager {
  private client: RedisClientType;
  private static instance: RedisManager;
  private static connecting: Promise<void>;

  private constructor() {
    this.client = createClient({
      url: "redis://localhost:6379",
    });
    RedisManager.connecting = this.client.connect();
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
      const size = await this.client.lPush(
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
