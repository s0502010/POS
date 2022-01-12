import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { hashPassword, checkPassword } from "./hash";
import menuEditRoute from "./menuEdit";
import http from "http";
import expressSession from "express-session";
import { orderedListStatusRoute } from "./orderedListStatus";
import { Server as SocketIO } from "socket.io";
import cmenuRoute from "./c-menu";
import menuOrderRoute from "./load_menu";
import { client } from "./db";
import { profileRoutes } from "./profile";
import kitchenRoute from "./kitchen";
import { confirmOrderRoute } from "./confirm";
import { logoutRoutes } from "./logout";

const app = express();

export const server = new http.Server(app);
export const io = new SocketIO(server);

import seatRoute from "./table";
import previewRoute from "./preview";

app.use(express.static("public"));
app.use(express.static("uploads"));

app.use(express.urlencoded());
app.use(express.json());
// app.use(bodyParser.json());

dotenv.config();

//session
const sessionMiddleware = expressSession({
  secret: "customer seat ID",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
});

app.use(sessionMiddleware);

//socket session
io.use((socket: any, next: any) => {
  let req = socket.request as express.Request;
  let res = req.res as express.Response;
  sessionMiddleware(req, res, next as express.NextFunction);
});

interface SeatData {
  SeatId: string;
}

//socket io
io.on("connection", function (socket: any) {
  // console.log("connected")

  socket.on("receive_seat_id", async (seat_id_obj: SeatData) => {
    // console.log(seat_id_obj.SeatId)
    socket.join(seat_id_obj.SeatId);
    const req = socket.request as express.Request;
    req.session["seatID"] = seat_id_obj;
    req.session.save();
    // console.log(req.session)

    await client.query(" update seats set status = $1 where name = $2", [
      "serving",
      seat_id_obj.SeatId,
    ]);
    // /*sql*/`update menu set type = $2 where type = $1`, [req.body.originType, req.body.updateType]
    io.emit("updateSeat", { update: true });
  });

  socket.on("updateToKitchen", async (itemList: any) => {
    io.emit("update", { update: true });
  });
});

// New register
app.post("/userRegister", async function (req: Request, res: Response) {
  const userName = req.body.userName;
  const userPhoneNumber = req.body.userPhoneNumber;
  // const userEmailID = req.body.userEmailID;
  const userDateOfBirth = req.body.userDateOfBirth;
  const userGender = req.body.userGender;
  let password = req.body.password;

  password = await hashPassword(password);

  // console.log(req.body);
  await client.query(
    "INSERT INTO users (name, password, mobile, date_of_birth, gender) values ($1, $2, $3, $4, $5)",
    [userName, password, userPhoneNumber, userDateOfBirth, userGender]
  );
  res.json({ success: true });
  // req.session.save();
});

// Member login
app.post("/userLogin", async function (req: Request, res: Response) {
  const userName = req.body.userName;
  const userPwd = req.body.userPwd;

  // console.log(req.body)

  let checkUser = await client.query(
    `select name, password, id from users where name = $1`,
    [userName]
  );
  let roleUser: any = await client.query(
    `select role from users where name = $1`,
    [userName]
  );

  // console.log(roleUser.rows[0].role)

  if (checkUser.rows.length > 0) {
    // if (checkUser.rows[0].password === userPwd) {
    let checkPwd = await checkPassword(userPwd, checkUser.rows[0].password);
    if (checkPwd) {
      req.session["user_id"] = checkUser.rows[0].id;
      console.log(checkUser.rows[0].id);
      req.session.save();
      if (roleUser.rows[0].role == "admin") {
        console.log(roleUser.rows[0].role);
        console.log("admin");
        return res.json({ success: "admin" });
      } else {
        console.log(roleUser.rows[0].role);
        console.log("user");
        return res.json({ success: "user" });
      }
    } else {
      return res.json({ success: false });
    }
  }
  return res.json({ success: false });
});

//guest login
app.get("/guestLogin", async function (req: Request, res: Response) {
  const guestLoginName = "guest";
  try {
    let result = await client.query(
      "INSERT INTO users (name) values ($1) RETURNING id",
      [guestLoginName]
    );
    console.log("user id", result.rows[0].id);
    req.session["user_id"] = result.rows[0].id;
    req.session.save();

    res.json({ success: true });
  } catch (error: any) {
    console.error("Failed to create guest", error);
  }
});

//Receive Seat Number and put it in session

// app.get('/seatID', (req,res)=>{
//   console.log(req.session);
//   res.json({seatID: req.session['seatID']});
// });

//get customer's confirmed order information
app.get("/userOrderedDish", async function (req: Request, res: Response) {
  const seatId = req.session["seatID"].SeatId;
  const sliced = seatId.slice(6);
  console.log("check slice", sliced);
  console.log("check 1a", typeof seatId);
  console.log("check 1b", seatId);
  try {
    let allDishes = await client.query(
      `select food_name, quantity, type, status from order_item where table_name = $1 AND status != $2`,
      [`table-${sliced}`, "paid"]
    );
    console.log("check 2", allDishes.rows);
    res.json(allDishes.rows);
  } catch (error: any) {
    console.log("failed to get ordered items", error);
  }
});

// testing page of cart

// Menu Edit Route for staff edit menu
app.use(orderedListStatusRoute);

// Menu Edit Route for staff edit menu
app.use(menuEditRoute);
app.use(cmenuRoute);
app.use(menuOrderRoute);
app.use(kitchenRoute);
app.use(seatRoute);
app.use(profileRoutes);
app.use(logoutRoutes);
app.use(previewRoute);

//Route for customer submiting confirmed order
app.use(confirmOrderRoute);

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});

/*

1. Phone scan QR CODE
2. qr
{
  SeatNo: 20,
  password : uythhjkhjhhgv
  restaurantName: slow food shop
}

3. goto some api "/setUserSeatus" / socket io

check password is correct 
if is correct

set req.session['seatID'] = qr.SeatNo

redirect to c-menu.html



*/
