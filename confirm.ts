import express from "express";
//import { Request, Response } from "express";
import {client} from "./db";


export const confirmOrderRoute = express.Router();



confirmOrderRoute.post("/submitOrder", async (req, res)=>{
    let data = req.body

    // if(data[0]==undefined){
    //     return
        
    // } 

    // console.log(data[0].tableNO)
    
    // const seatStatus = await client.query(/*sql*/` select status from seats where name = $1`, [data[0].tableNO])

    // console.log(seatStatus.rows)


    const ids = [];
    for (let val of data){
        const res = await client.query(/*sql*/`INSERT INTO order_item (table_name, food_name, description, price, quantity, type, status) Values($1,$2,$3,$4,$5,$6,$7) returning id`,
        [val.tableNO, val.name, ,val.price, val.numberOfItm, val.type, val.status]
        );
        ids.push(res.rows[0].id);
    }
//server send back reponse to client :sucess or not
    res.json({success: true});

    // res.redirect(`/orderedItemStatus.html?ids=${JSON.stringify(ids)}`)

});

// confirmOrderRoute.post('/checkStatus', async (req, res)=>{

//     let data = req.body

//     // console.log(data[0].tableNO)
    
//     const seatStatus = await client.query(/*sql*/` select status from seats where name = $1`, [data[0].tableNO])

//     res.json(seatStatus.rows);

// })

export default confirmOrderRoute;
