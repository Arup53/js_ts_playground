import { Router, type Request, type Response } from "express";

import { RedisManager } from "../../RedisManager";
import SQSManager from "../aws_clients/sqsManager";
import type { PostEventsBody } from "../types/types";

export const postAnonymousEvents = Router();

postAnonymousEvents.post(
  "/",
  async (req: Request<{}, {}, PostEventsBody>, res: Response) => {
    const { events: eventsBatch } = req.body;
    if (!Array.isArray(eventsBatch)) {
      return res.status(400).json({ message: "Invalid events payload" });
    }
    // const redis = await RedisManager.getInstance();
    const sqsManager = new SQSManager();

    for (const event of eventsBatch) {
      try {
        // const response = await redis.addEventInQueue(event);
        const response = await sqsManager.enqueue(event);
        console.log("Succesfull event pushing in Queue", response);
      } catch (e) {
        throw new Error(
          "Operation Failed to send event to sqs for event:" + event.event
        );
      }
    }

    res.json({ message: "Events added to queue succesfully" });
  }
);
