export class Publisher {
  async publish(channel, message) {
    const parsed_message = JSON.parse(message);
    console.log("Channel is ", channel);
    console.log("message is ", parsed_message);
  }
}

export default Publisher;
