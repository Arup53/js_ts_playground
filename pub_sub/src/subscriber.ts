import { createClient } from "redis";

async function startSubscriber() {
  const subscriber = createClient({
    url: "redis://localhost:6379",
  });

  subscriber.on("error", (err: any) => {
    console.log("Redis Client Error", err);
  });

  await subscriber.connect();
  console.log("Subscriber connected to Redis");

  await subscriber.subscribe("notifications", (message) => {
    console.log("Received message:", message);
  });
}

startSubscriber().catch(console.error);
