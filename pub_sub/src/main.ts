import { redisPublisher } from "./publisher";

async function main() {
  redisPublisher.Connect();
  console.log("Connected to Redis Publisher");
  const orderManager = new Orde();
}
