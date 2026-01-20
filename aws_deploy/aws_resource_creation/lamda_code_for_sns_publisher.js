import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize SNS client
const snsClient = new SNSClient({ region: "ap-southeast-1" });
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

export const handler = async (event, context) => {
  try {
    // Parse the incoming JSON body
    const body = JSON.parse(event.body);

    // Log the received data
    console.log("Received data:", body);

    // Prepare SNS message
    const snsMessage = {
      event: "API_POST_RECEIVED",
      timestamp: context.requestId,
      data: body,
    };

    // Publish to SNS
    const publishCommand = new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Message: JSON.stringify(snsMessage),
      Subject: "New API POST Request Received",
      MessageAttributes: {
        event_type: {
          DataType: "String",
          StringValue: "api_post",
        },
      },
    });

    const snsResponse = await snsClient.send(publishCommand);
    console.log("SNS Message ID:", snsResponse.MessageId);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Success! Data received and notification sent.",
        receivedData: body,
        snsMessageId: snsResponse.MessageId,
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error processing request",
        error: error.message,
      }),
    };
  }
};
