import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import type { snsTopic, snsTopicConfig } from "./types/types";

export class Publisher {
  private client;
  private arn_topic_container;

  constructor() {
    this.client = new SNSClient({ region: "us-east-1" });
    this.arn_topic_container = {
      email: process.env.EMAIL_TOPIC,
      sms: process.env.SMS_TOPIC,
      slack: process.env.SLACK_TOPIC,
    };
  }

  async publish(channel, message) {
    if (!channel || !message) {
      console.log("Invalid argument in publish method");
      return;
    }
    const parsed_message = JSON.parse(message);
    console.log("Channel is ", channel);
    console.log("message is ", parsed_message);

    try {
      const response = await this.sendToSns(channel, parsed_message);
      console.log(response);
    } catch (e) {
      throw new Error(`publish method failed to send`);
    }
  }

  async sendToSNS(topic, body) {
    if (!topic || !body) {
      throw new Error("SNS Topic or body is invalid");
    }

    const topicConfig: snsTopicConfig = {
      sms: {
        arn: this.arn_topic_container.sms!,
        error: "Failed send sms",
      },
      email: {
        arn: this.arn_topic_container.email!,
        error: "Failed send email",
      },
      slack: {
        arn: this.arn_topic_container.slack!,
        error: "Failed send slack message",
      },
    };

    const config: snsTopic = topicConfig[topic];

    if (!config) {
      throw new Error(`Unsupported topic: ${topic}`);
    }

    const command = this.publishCommandWrapper(config.arn, body);

    try {
      const response = await this.client.send(command);
      console.log("SNS Message ID:", response.MessageId);
    } catch (e) {
      throw new Error(config.error);
    }
  }

  publishCommandWrapper(arn, message) {
    if (!arn) {
      throw new Error("SNS Topic ARN is undefined");
    }

    const publishCommand = new PublishCommand({
      TopicArn: arn,
      Message: JSON.stringify(message),
    });
    return publishCommand;
  }
}

export default Publisher;
