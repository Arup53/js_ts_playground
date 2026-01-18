import { RedisClientType, createClient } from "redis";

interface Task {
  order_id: string;
  action: string;
  amount: number;
}

class TaskConsumer {
  private workerId: string;
  private client: RedisClientType | null = null;
  private isRunning: boolean;

  constructor(workerId: string) {
    this.workerId = workerId;
    this.client = null;
    this.isRunning = false;
  }

  async connect() {
    if (this.client) return;

    this.client = createClient({
      url: "redis://localhost:6379",
    });

    this.client.on("error", (err) => {
      console.log("Redis client connection error at consumer", err);
    });

    await this.client.connect();
    console.log("worker connected succesfully");
  }

  async startConsuming(queueName: string) {
    if (!this.client) {
      throw new Error("Client not connected");
    }
    this.isRunning = true;
    while (this.isRunning) {
      try {
        const element: string | null | undefined = await this.client?.rPop(
          queueName
        );

        if (element) {
          console.log("element from queue results", element);
          const task = JSON.parse(element);

          await this.processTask(task);
        }
      } catch (err) {
        console.log(`Worker ${this.workerId} has faced error `, err);
      }
    }
  }

  async processTask(task: Task): Promise<void> {
    console.log(`\n Worker ${this.workerId} processing:`, task);

    const processingTime: number = Math.floor(Math.random() * 3000) + 1000;
    await new Promise<void>((resolve) => setTimeout(resolve, processingTime));

    console.log(
      ` Worker ${this.workerId} completed: ${task.order_id} (${processingTime}ms)`
    );
  }

  async stop() {
    this.isRunning = false;
    if (this.client) {
      await this.client.quit();
      console.log(`Worker ${this.workerId} stopped`);
    }
  }
}
