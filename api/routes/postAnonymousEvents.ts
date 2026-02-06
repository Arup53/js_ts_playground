import {Router} from "express";
import { RedisManager } from "../RedisManager";

export const postAnonymousEvents = Router();

postAnonymousEvents.post('/', async (req , res)=>{

    const {events: eventsBatch}= req.body;

    const redis = await RedisManager.getInstance();


    for (const event of eventsBatch){
      const response = await redis.addEventInQueue(event);
      console.log("Succesfull event pushing in Queue", response);
    }

    res.json({message:"Events added to queue succesfully"})

} )