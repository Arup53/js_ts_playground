import { Router } from "express";
import { query } from "../config/db/db";

export const anonEventsRegisters= Router()

anonEventsRegisters.post('/', async(req,res)=>{
    const {events,anonymous_id,tenant_id}= req.body
    console.log(events,anonymous_id)
    const anonymous_person_id= +(anonymous_id);
    const tenant= +(tenant_id);
    console.log(tenant)
    const text="SELECT anonymous_ids.person_id FROM anonymous_ids WHERE anonymous_ids.tenant_id= $1 AND anonymous_ids.anonymous_id= $2"
    const result =await query(text,[tenant,anonymous_id])
    // console.log(result.rows[0]);

    if (!result.rows[0]){
        const text= "INSERT INTO persons (tenant_id) VALUES ($1) RETURNING id"
        const result= await query(text,[tenant]);
        console.log(result.rows[0]);
        const person= +(result.rows[0])
        const text2="INSERT INTO anonymous_ids (tenant_id,anonymous_id, person_id) VALUES ($1, $2, $3)" ;
        const result2 = await query(text,[tenant,anonymous_id,person])
        console.log("Successful in line 23", result2.rows[0])
    }

    res.json({mesg:"Task successful"})
})