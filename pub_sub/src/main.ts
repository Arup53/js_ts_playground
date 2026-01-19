import TaskConsumer from "./consumerMessagequeue";
import OrderManager from "./orderManager";
import TaskProducer from "./publiserMessagequeue";
import { redisPublisher } from "./publisher";
import startSubscriber from "./subscriber";

async function main() {
  // await startSubscriber().catch(console.error);
  // console.log("subscriber connected");
  // await redisPublisher.connect();
  // console.log("Connected to Redis Publisher");
  // const orderManager = new OrderManager(redisPublisher);
  // console.log("Order manager object created");
  // console.log("\n--- Creating Orders ---\n");
  // const order1 = await orderManager.createOrder(
  //   "user123",
  //   [
  //     { productId: "PROD-001", name: "Laptop", quantity: 1, price: 999.99 },
  //     { productId: "PROD-002", name: "Mouse", quantity: 2, price: 29.99 },
  //   ],
  //   1059.97
  // );

  const workers: any = [];
  const numWorkers = 3;
  const producer = new TaskProducer();
  await producer.connect();

  await producer.addTask("order:processing", {
    order_id: "ORD-001",
    action: "process_payment",
    amount: 99.99,
  });

  await producer.addTask("order:processing", {
    order_id: "ORD-002",
    action: "process_payment",
    amount: 149.99,
  });

  await producer.addTask("order:processing", {
    order_id: "ORD-003",
    action: "process_payment",
    amount: 79.99,
  });

  console.log("\n All tasks added to queue");

  // --------- multiple worker ----------
  // for (let i = 1; i <= numWorkers; i++) {
  //   const worker = new TaskConsumer(i);
  //   await worker.connect();
  //   workers.push(worker);

  //   // Start consuming in parallel (don't await here)
  //   worker.startConsuming("order:processing");
  // }

  // ------------ single worker --------------
  const worker = new TaskConsumer(1);
  await worker.connect();
  workers.push(worker);

  await worker.startConsuming("order:processing");

  process.on("SIGINT", async () => {
    console.log("\n\nShutting down workers...");
    for (const worker of workers) {
      await worker.stop();
    }
    process.exit(0);
  });
}

main();
