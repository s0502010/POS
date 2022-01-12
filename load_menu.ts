import express from 'express'
import dotenv from 'dotenv';
import {client} from "./db";

const menuOrderRoute = express.Router()

dotenv.config();
// export const client = new Client({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD
// });
// client.connect()

menuOrderRoute.get('/getMenuType', async (req, res) => {
    const menuType = await client.query('select * from menu_type')
    res.json(menuType)
    // console.log(menuItem.rows)
})

menuOrderRoute.get('/getMenuItem', async (req, res) => {
    const menuItem = await client.query('select * from menu')
    res.json(menuItem)
    // console.log(menuItem.rows)
})

menuOrderRoute.post("/reciveOrderList", async (req, res) => {

    let data = req.body

    // console.log(data[0].tableNO)

    await client.query(" update seats set status = $1 where name = $2",[ 'serving' ,`${data[0].tableNO}`]);

    for (let val of data) {
        await client.query(
            "INSERT INTO order_item (food_name, quantity, price,table_name,type,status) values ($1, $2, $3,$4,$5,$6)",
            [val.name, val.numberOfItm, val.price, val.tableNO, val.type, val.status]
        );
    }

    res.json({ success: true });

});

menuOrderRoute.post('/getOrderItem', async(req, res) => {
    // console.log(req.body.tableName)
    const menuType = await client.query(`select * from order_item where table_name = $1 AND (status = 'cooking' OR status = 'complete') order by id asc`, [req.body.tableName])

    // console.log(menuType.rows)

    // const menuType = await client.query(`
    // select * from order_item 
    // where table_name = $1 
    // AND status IN ('cooking', 'complete', 'xxxxxx')
    // order by id asc`
    // , [req.body.tableName])

    res.json(menuType.rows)

})


export default menuOrderRoute;