import express from 'express'
import dotenv from 'dotenv';
import {client} from "./db";

const previewRoute  = express.Router()

dotenv.config();
// export const client = new Client({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD
// });
// client.connect()

previewRoute.get("/revenueReview", async(req, res) => {
    const  revenue= await client.query('select food_name, sum(quantity), sum(price * quantity) num from order_item GROUP BY food_name')
    res.json(revenue.rows)
})

export default previewRoute;