import express from 'express'
import dotenv from 'dotenv';
import {client} from "./db";
import { io } from './server';
//import { loginOnly } from './guard';
// import { io } from './server';

const kitchenRoute = express.Router()

dotenv.config();
// export const client = new Client({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD
// });
// client.connect()

kitchenRoute.get('/getOrderFood', async (req, res) => {
    const cooking = await client.query(`select * from order_item WHERE status = 'cooking'`)
    const co = cooking.rows
    res.json(co)

    
    // console.log(co)
})
kitchenRoute.get('/getcompleteFood', async (req, res) => {
    const cooking = await client.query(`select * from order_item WHERE status = 'complete'`) 
    const co = cooking.rows
    res.json(co)
    // console.log(co)
})


kitchenRoute.post('/finshFood', async (req, res) => {
    await client.query(`update order_item set status = $1 where id = $2`, [req.body.status, req.body.foodId])


    //io.to(req.session["seatID"].SeatId).emit("updateStatus",{});
    io.emit("updateStatus", {});


    res.json({ success: true });
   
})



export default kitchenRoute;