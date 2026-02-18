import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

type SQSMessage = {
  tenant_id: number;
  anonymous_id: number;
  user_id: number;
  event: string;
  properties: Record<string, any>;
};

class SQSManager {
  private sqs_url;
  private client;
  constructor() {
    this.client = new SQSClient({});
    this.sqs_url = process.env.SQS_URL;
  }

  async enqueue(message: SQSMessage) {
    if (!this.sqs_url) {
      throw new Error("SQS_URL is not defined in environment variables");
    }

    const command = new SendMessageCommand({
      QueueUrl: this.sqs_url,
      MessageBody: JSON.stringify(message),
    });

    try {
      const response = await this.client.send(command);
      return response;
    } catch (error) {
      console.error("Failed to send SQS message:", error);
      throw error;
    }
  }

  async dequeue(): Promise<SQSMessage | null> {
    if (!this.sqs_url) {
      throw new Error("SQS_URL is not defined");
    }

    const receiveCommand = new ReceiveMessageCommand({
      QueueUrl: this.sqs_url,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10, // long polling
    });

    const response = await this.client.send(receiveCommand);

    if (!response.Messages || response.Messages.length === 0) {
      return null;
    }

    const message = response.Messages[0];

    if (!message?.Body || !message?.ReceiptHandle) {
      return null;
    }

    // Parse body
    const body = JSON.parse(message.Body) as SQSMessage;

    // Delete message after successful read
    const deleteCommand = new DeleteMessageCommand({
      QueueUrl: this.sqs_url,
      ReceiptHandle: message.ReceiptHandle,
    });

    await this.client.send(deleteCommand);

    return body;
  }
}
