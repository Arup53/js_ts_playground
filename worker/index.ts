import { createClient } from "redis";

async function main() {
  const redisClient = createClient({
    url: "redis://127.0.0.1:6379"
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  await redisClient.connect();
  console.log("Worker connected to Redis");

  while (true) {
    try {
      const result = await redisClient.brPop("event_queue", 0);

      if (!result) continue;

      const event = JSON.parse(result.element);

      console.log("Processing event:", event);

      // await handleEvent(event);`

    } catch (err) {
      console.error("Worker error:", err);
    }
  }
}

main();
