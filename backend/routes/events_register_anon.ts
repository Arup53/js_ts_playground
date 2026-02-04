import { Router } from "express";
import { query } from "../config/db/db";

export const anonEventsRegisters = Router();

anonEventsRegisters.post("/", async (req, res) => {
  const { events, anonymous_id, tenant_id } = req.body;
  // console.log(events,anonymous_id)
  // const tenant= +(tenant_id);
  // console.log(tenant)
  // const text="SELECT anonymous_ids.person_id FROM anonymous_ids WHERE anonymous_ids.tenant_id= $1 AND anonymous_ids.anonymous_id= $2"
  // const result =await query(text,[tenant,anonymous_id])
  // console.log(result.rows[0]);
  res.json({ mesg: "Task successfull" });
});
