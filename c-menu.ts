
import express from 'express'
import dotenv from 'dotenv';
import { client } from './db';
//import multer from 'multer';


const cmenuRoute = express.Router();

// cmenuRoute.use(express.static('public'))
// cmenuRoute.use(express.urlencoded());
// cmenuRoute.use(express.json())

//read .env and connect to database
dotenv.config();

cmenuRoute.get('/c-menu', async (req, res) => {
    try {
        let result = await client.query('SELECT * from menu_type')
        let list = result.rows

        list.forEach( item => item.foodList = [] )

        result = await client.query('SELECT id, name, price, type, image from menu')
        result.rows.forEach(row => {
            let item = list.find(item => item.type == row.type)
            item.foodList.push(row)
        })


        //  SELECT mt.type,
        // json_agg(
        //   json_build_object(
        //     'name' , mu.name,
        //     'price', mu.price,
        //     'image', mu.image
        //   )
        // )
        // FROM menu_type mt
        // JOIN menu mu ON mt.type = mu.type
        // GROUP by mt.type;

        res.json(list)

        
    } catch (error) {

        res.status(500).json({ error: error.toString() })
    }
})

cmenuRoute.get('/getcmenuType', async (req, res) => {
    const cmenuType = await client.query('SELECT * from menu_type')
    res.json(cmenuType.rows)
    // console.log(cmenuType.rows)
})

cmenuRoute.get('/getcmenuItem', async (req, res) => {
    const cmenuItem = await client.query('SELECT * from menu')
    res.json(cmenuItem)
    // console.log(cmenuItem.rows)
})

export default cmenuRoute;