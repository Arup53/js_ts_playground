export const handler = async (event) => {
  try {
    // Parse the incoming JSON body
    const body = JSON.parse(event.body);

    // Log the received data
    console.log("Received data:", body);

    // Your business logic here

    // Return success response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Success! Data received.",
        receivedData: body,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
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
