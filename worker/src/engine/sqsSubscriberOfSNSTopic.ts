import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

class sqsConsumerOfSNSTopic {
  private reigon: string | null;
  private sqs_url_for_sns: string | null;
  private sns_url: string | null;
  private client;

  constructor() {
    if (
      !process.env.REGION ||
      !process.env.SQS_URL_FOR_SNS ||
      !process.env.SNS_URL
    ) {
      throw new Error(
        "Region or SQS URL or SNS url not correct in sqsConsumer"
      );
    }

    this.reigon = process.env.REGION;
    this.sqs_url_for_sns = process.env.SQS_URL_FOR_SNS;
    this.sns_url = process.env.SNS_URL;
    this.client = new SQSClient(this.reigon);
  }

  parseSNSEnvelope(sqsMessage) {
    try {
      const snsEnvelope = JSON.parse(sqsMessage.Body!);
      const innerMessage = JSON.parse(snsEnvelope.Message);
      return innerMessage;
    } catch (err) {
      console.error("Failed to parse message:", err);
      return null;
    }
  }
  async deleteMessage(receiptHandle: string): Promise<void> {
    await this.client.send(
      new DeleteMessageCommand({
        QueueUrl: this.sqs_url_for_sns!,
        ReceiptHandle: receiptHandle,
      })
    );
  }
  async processMessage(message) {
    console.log("Processing email:", message);
    return message;
  }

  async pollQueue() {
    console.log("Starting SQS consumer, polling...");

    while (true) {
      const response = await this.client.send(
        new ReceiveMessageCommand({
          QueueUrl: this.sqs_url_for_sns!,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20,
          VisibilityTimeout: 30,
        })
      );

      const messages = response.Messages ?? [];

      if (messages.length === 0) {
        console.log("No messages, waiting...");
        continue;
      }

      for (const sqsMessage of messages) {
        const emailMessage = this.parseSNSEnvelope(sqsMessage);

        if (!emailMessage) {
          await this.deleteMessage(sqsMessage.ReceiptHandle!);
          continue;
        }

        try {
          await this.processMessage(emailMessage);

          await this.deleteMessage(sqsMessage.ReceiptHandle!);
          console.log("Message processed and deleted:", sqsMessage.MessageId);
        } catch (err) {
          // DLQ
          console.error("Processing failed, message will retry:", err);
        }
      }
    }
  }
}
