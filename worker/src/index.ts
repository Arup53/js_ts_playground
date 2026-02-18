import { createClient } from "redis";
import Publisher from "./engine/publisher";
import CampaignService from "./engine/services/campaignService";
import Engine from "./engine/engine";

async function main() {
  const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  await redisClient.connect();
  console.log("Worker connected to Redis");

  const publisher = new Publisher();
  const campaignService = new CampaignService();
  const engine = new Engine(publisher, campaignService);

  while (true) {
    try {
      const result = await redisClient.brPop("event_queue", 0);

      if (!result) continue;

      const event = JSON.parse(result.element);

      console.log("Processing event:", event);

      await engine.process(event);

      console.log(
        "Length of queue after processing",
        await redisClient.lLen("event_queue")
      );
    } catch (err) {
      console.error("Worker error:", err);
    }
  }
}

main();
