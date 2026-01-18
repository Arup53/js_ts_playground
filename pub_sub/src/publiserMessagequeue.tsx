import { RedisClientType, createClient } from "redis";

interface Task {
  order_id: string;
  action: string;
  amount: number;
}

class TaskProducer {
  private client: RedisClientType | null = null;

  constructor() {
    this.client = null;
  }

  async connect() {
    this.client = createClient({
      url: "redis://localhost:6379",
    });

    this.client.on("error", (err) => {
      console.log("Redis client connection error at producer", err);
    });

    await this.client.connect();
    console.log("Redis client connected succesfully");
  }

  async addTask(queueName: string, task: Task) {
    const taskData = typeof task === "object" ? JSON.stringify(task) : task;

    const queueSize = await this.client?.lPush(queueName, taskData);
    console.log(`Task pushed in ${queueName} & size of queue is ${queueSize}`);
  }
}
