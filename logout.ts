import express from "express";


export const logoutRoutes = express.Router();

logoutRoutes.get("/logout", async (req,res) =>{
   delete req.session['user_id']
   req.session.save()
   return res.json({success: true})
})