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

    try {
      const response = await this.sendToSns(channel, message);
      console.log(response);
    } catch (e) {
      throw new Error(`publish method failed to send`);
    }
  }

  async sendToSns(topic, body) {
    if (!topic || !body) throw new Error("SNS Topic or body is invalid");

    switch (topic) {
      case "sms":
        const command_sms = this.publishCommandWrapper(
          this.arn_topic_container.sms,
          body
        );
        try {
          const response_sms_send = await this.client.send(command_sms);
          console.log("SNS Message ID:", response_sms_send.MessageId);
        } catch (e) {
          console.log("Failed send sms");
        }
        break;
      case "email":
        const command_email = this.publishCommandWrapper(
          this.arn_topic_container.email,
          body
        );
        try {
          const response_email_send = await this.client.send(command_email);
          console.log("SNS Message ID:", response_email_send.MessageId);
        } catch (e) {
          throw new Error("Failed send email");
        }
        break;
      case "slack":
        const command_slack = this.publishCommandWrapper(
          this.arn_topic_container.slack,
          body
        );

        try {
          const response_slack_send = await this.client.send(command_slack);
          console.log("SNS Message ID:", response_slack_send.MessageId);
        } catch (e) {
          throw new Error("Failed send slack message");
        }
        break;
      default:
        throw new Error(`Unsupported topic: ${topic}`);
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
