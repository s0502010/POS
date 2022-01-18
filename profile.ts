import express from "express";
import { client } from "./db";

export const profileRoutes = express.Router();

profileRoutes.get("/customerInfo", async (req,res) =>{
    // res.json(req.session['user_id']);
    console.log("the user id",req.session['user_id'])
    try {
        let customerInfo = await client.query(
            `select name, gender, mobile, date_of_birth from users where id = $1`, [req.session['user_id']]
        )
        console.log(customerInfo.rows);
        res.json(customerInfo.rows);
    } catch (error:any) {

        console.log("cannot query guest",error)
        
    }
    

})



