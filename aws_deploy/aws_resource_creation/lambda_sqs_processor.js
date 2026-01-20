export const handler = async (event) => {
  console.log(`Received ${event.Records.length} messages from SQS`);

  // Process each message
  for (const record of event.Records) {
    try {
      // Get the message body
      const messageBody = record.body;

      // Parse the SNS message envelope
      const snsMessage = JSON.parse(messageBody);

      // Extract the actual message content
      const actualMessage = JSON.parse(snsMessage.Message);

      // Log the message details
      console.log("Processing message:");
      console.log(`  Message ID: ${record.messageId}`);
      console.log(`  SNS Subject: ${snsMessage.Subject || "No subject"}`);
      console.log(`  Actual Message:`, actualMessage);

      // YOUR BUSINESS LOGIC HERE
      await processMessage(actualMessage);

      console.log(`Successfully processed message ${record.messageId}`);
    } catch (error) {
      console.error(`Error processing message ${record.messageId}:`, error);
      // Re-throw to send message to DLQ
      throw error;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      `Successfully processed ${event.Records.length} messages`
    ),
  };
};

async function processMessage(message) {
  // Your custom business logic here
  console.log("Custom processing:", message);

  // Example: Validate data
  if (message.name) {
    console.log(`Processing request for: ${message.name}`);
  }

  // Example: Save to database, call API, etc.

  return true;
}
