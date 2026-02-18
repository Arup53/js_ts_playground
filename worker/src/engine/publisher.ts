import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

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
    const parsed_message = JSON.parse(message);
    console.log("Channel is ", channel);
    console.log("message is ", parsed_message);
  }

  publishCommandWrapper(arn, message) {
    const publishCommand = new PublishCommand({
      TopicArn: arn,
      Message: JSON.stringify(message),
    });
    return publishCommand;
  }
}

export default Publisher;
