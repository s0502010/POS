import express from 'express'
import dotenv from 'dotenv';
// import { Client } from 'pg';
import {client} from "./db";
import multer from 'multer';
import path from 'path'
// import {Server as SocketIO} from 'socket.io';
// import http from 'http';

const menuEditRoute = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
})

const upload = multer({ storage })

dotenv.config();

// export const client = new Client({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD
// });

// client.connect()

menuEditRoute.post("/itemSubmitInMenu", upload.single('image'), async (req, res) => {
    await client.query(/*sql*/`insert into menu (name,description,type,status,price,image) Values ($1,$2,$3,$4,$5,$6)`,
        [req.body.itemName, req.body.itemDescription, req.body.itemType, req.body.itemStatus, req.body.itemPrice, req.file?.filename])
        const menuItem = await client.query('select * from menu order by id asc')
        res.json(menuItem.rows)
})

menuEditRoute.post("/typeSubmitInCategory", async (req, res) => {
    await client.query(/*sql*/`insert into menu_type (type) Values ($1)`, [req.body.categoryType])
    
})

menuEditRoute.get("/Menu/Type", async (req, res) => {
    const menuType = await client.query('select * from menu_type order by id asc')
    res.json(menuType.rows)
})

menuEditRoute.get("/Menu/Item", async (req, res) => {
    const menuItem = await client.query('select * from menu order by id asc')
    res.json(menuItem.rows)
})

menuEditRoute.get("/Menu/All", async (req, res) => {
    type Category = {
        id: number
        type: string
    }
    type Menu = {
        menu_type_id: number
        type: string
        name: string
        price: number
    }
    type Item = {
        category: Category
        menuList: Menu[]
    }
    const menuTypeResult = await client.query('select id, type from menu_type')
    const menuResult = await client.query('select menu_type_id, type, name, price from menu')

    let list = menuTypeResult.rows.map((category: Category): Item => ({
        category,
        menuList: []
    }))

    menuResult.rows.forEach((menu: Menu) => {
        // let item = list.find(item => item.category.id === menu.menu_type_id)
        let item = list.find(item => item.category.type === menu.type)
        item?.menuList.push(menu)
    })

    res.json(list)
})

menuEditRoute.put("/updateCategory", async (req, res) => {
    // console.log(req.body.originType, req.body.updateType)
    await client.query(/*sql*/`update menu_type set type = $2 where type = $1`, [req.body.originType, req.body.updateType])  
    await client.query(/*sql*/`update menu set type = $2 where type = $1`, [req.body.originType, req.body.updateType])
    const menuItem = await client.query('select * from menu order by id asc')
    res.json(menuItem.rows)
    // console.log(menuItem.rows)
    
})

menuEditRoute.put("/updateItem", upload.single('image'), async (req, res) => {
    // console.log(req.body.originItemName)
    await client.query(/*sql*/`update menu set (name,description,type,status,price,image) = ($1,$2,$3,$4,$5,$6) where (id) = ($7)`, 
    [
        req.body.itemName, req.body.itemDescription, req.body.itemType, req.body.itemStatus, req.body.itemPrice, req.file?.filename, req.body.originItemId
    ])
    res.json({})
})

menuEditRoute.delete("/deleteCategory", async (req, res) => {
    // console.log(req.body)
    await client.query('delete from menu_type where type = $1', [req.body.type])
    await client.query('delete from menu where type = $1', [req.body.type])

    let TypeList = await client.query('select * from menu_type')
    res.json(TypeList.rows)
})

menuEditRoute.delete("/deleteItem", async (req, res) => {
    await client.query('delete from menu where id = $1', [req.body.id])

    res.json('delete')
})

export default menuEditRoute;