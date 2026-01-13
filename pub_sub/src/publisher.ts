import { createClient, RedisClientType } from "redis";

// async function startPublisher() {
//   const publisher = createClient({
//     url: "redis://localhost:6379",
//   });

//   publisher.on("error", (err: any) => {
//     console.log("Redis Client Error", err);
//   });

//   await publisher.connect();
//   console.log("Publisher connected to Redis");

//   await publisher.publish("notifications", "Hello from publisher");
//   console.log("Published to notifications channel");
// }

// startPublisher().catch(console.error);

class RedisPubliser {
  private client: RedisClientType | null = null;
  private isConnected: boolean;

  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async Connect() {
    if (this.isConnected) {
      return;
    }

    this.client = createClient({
      url: "redis://localhost:63379",
    });

    this.client.on("error", (err) => {
      console.log("Redis connection error", err);
      this.isConnected = false;
    });

    await this.client.connect();
    this.isConnected = true;
    console.log("Publisher conencted to Redis");
  }

  async Publish(channel: any, message: any) {
    if (!this.isConnected) {
      await this.Connect();
    }

    // // object may be nul solution 2 --- type guard
    if (!this.client) {
      throw new Error("Failed to connect to Redis");
    }

    const payload =
      typeof message === "object" ? JSON.stringify(message) : message;
    // object may be nul solution one is non-null asertion operator !
    // const count = await this.client!.publish(channel, payload);
    const count = await this.client.publish(channel, payload);
    console.log(`Published to ${channel} (${count} subscribers)`);
    return count;
  }

  async Disconnect() {
    if (this.client && this.isConnected) {
      await this.client?.quit();
      this.isConnected = false;
      console.log("Redis Publisher disconnected");
    }
  }
}

export const redisPublisher = new RedisPubliser();
