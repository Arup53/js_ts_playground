import { createClient } from "redis";

async function startPublisher() {
  const publisher = createClient({
    url: "redis://localhost:6379",
  });

  publisher.on("error", (err: any) => {
    console.log("Redis Client Error", err);
  });

  await publisher.connect();
  console.log("Publisher connected to Redis");

  await publisher.publish("notifications", "Hello from publisher");
  console.log("Published to notifications channel");
}

startPublisher().catch(console.error);
