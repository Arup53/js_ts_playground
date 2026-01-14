import OrderManager from "./orderManager";
import { redisPublisher } from "./publisher";
import startSubscriber from "./subscriber";

async function main() {
  await startSubscriber().catch(console.error);
  console.log("subscriber connected");
  await redisPublisher.connect();
  console.log("Connected to Redis Publisher");
  const orderManager = new OrderManager(redisPublisher);
  console.log("Order manager object created");

  console.log("\n--- Creating Orders ---\n");

  const order1 = await orderManager.createOrder(
    "user123",
    [
      { productId: "PROD-001", name: "Laptop", quantity: 1, price: 999.99 },
      { productId: "PROD-002", name: "Mouse", quantity: 2, price: 29.99 },
    ],
    1059.97
  );
}

main();
