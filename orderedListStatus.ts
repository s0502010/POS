// import pg from "pg";
import express from "express";
import { Request, Response } from "express";
//import http from 'http';
//import {Server as SocketIO} from 'socket.io';
//import expressSession from "express-session";

import { client } from "./db";

export const orderedListStatusRoute = express.Router();


orderedListStatusRoute.get("/seatID", (req, res) => {
  // console.log(req.session);
  res.json({ seatID: req.session["seatID"] });
});

//get customer's confirmed order information
orderedListStatusRoute.get(
  "/userOrderedDish/:seatId",
  async function (req: Request, res: Response) {
    const seatId = req.session["seatID"].SeatId;

    // console.log(seatId);

    let allDishes = await client.query(
      `select food_name, quantity, type, status from order_item where seats_id = $1`,
      [seatId]
    );

    res.json(allDishes.rows);
    // console.log(allDishes.rows);
  }
);
