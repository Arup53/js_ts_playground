import { Router } from "express";
import { RedisManager } from "../RedisManager";

export const postAnonymousEvents = Router();

postAnonymousEvents.post("/", async (req, res) => {
  const { events: eventsBatch } = req.body;

  const redis = await RedisManager.getInstance();

  for (const event of eventsBatch) {
    try {
      const response = await redis.addEventInQueue(event);
      console.log("Succesfull event pushing in Queue", response);
    } catch (e) {
      throw new Error(
        "Operation Failed to send event to sqs for event:",
        event.event
      );
    }
  }

  res.json({ message: "Events added to queue succesfully" });
});
