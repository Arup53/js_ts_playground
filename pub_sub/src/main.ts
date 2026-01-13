import OrderManager from "./orderManager";
import { redisPublisher } from "./publisher";

async function main() {
  redisPublisher.Connect();
  console.log("Connected to Redis Publisher");
  const orderManager = new OrderManager();
  console.log("Order manager object created");
}
