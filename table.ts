import express from 'express'
import dotenv from 'dotenv';
import {client} from "./db";
// import { io } from './server';
// import { Socket } from 'socket.io';
// import { io } from './server';



const seatRoute  = express.Router()



dotenv.config();
// export const client = new Client({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD
// });
// client.connect()

seatRoute.get('/getSeat', async(req, res) => {
    const menuType = await client.query('select * from seats order by id asc')
    res.json(menuType)
})

seatRoute.put("/resetTable", async(req,res) => {
    // console.log(req.body.name)
    await client.query('update seats set status = $1 where name = $2' , [req.body.originStatus, req.body.name])
    await client.query('update order_item set status = $1 where table_name = $2' , [req.body.foodStatus, req.body.name])
    res.json({})
})







export default seatRoute;

