import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

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

  async sendMessageToSQS(message: SQSMessage) {
    if (!this.sqs_url) {
      throw new Error("SQS_URL is not defined in environment variables");
    }

    const command = new SendMessageCommand({
      QueueUrl: this.sqs_url,
      MessageBody: JSON.stringify(message),
      MessageAttributes: {
        tenant_id: {
          DataType: "Number",
          StringValue: message.tenant_id.toString(),
        },
        event: {
          DataType: "String",
          StringValue: message.event,
        },
      },
    });

    try {
      const response = await this.client.send(command);
      return response;
    } catch (error) {
      console.error("Failed to send SQS message:", error);
      throw error;
    }
  }
}
