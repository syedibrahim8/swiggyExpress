import express from "express";
import restaurantModel from "../../models/Restaurant/Restaurant.js";
import menuModel from "../../models/Menu/Menu.js";
import saleModel from "../../models/Sales/Sales.js";

const router = express.Router()

router.post("/addmenu",async (req,res)=>{
  try {
    let restaurant = await restaurantModel.findOne({_id:req.user.id},{_id:1})
    if(!restaurant) return res.status(400).json({msg:"User not found"})
    let {itemName,itemPrice,category} = req.body
    let menuPayload = {
      restaurant_id:restaurant._id,
      itemName,
      itemPrice,
      category
    }
    await menuModel.insertOne(menuPayload)
    res.status(201).json({msg:"Item added to menu"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error}) 
  }
})

router.put("/edititem/:itemId",async (req,res)=>{
  try {
    let restaurant = await restaurantModel.findOne({_id:req.user.id},{_id:1})
    if(!restaurant) return res.status(400).json({msg:"User not found"})
    let userInput = req.body
    await menuModel.updateOne({restaurant_id:restaurant._id,_id:req.params.itemId},{$set:userInput},{strict:false})
    res.status(201).json({msg:"Menu edited successfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})
  }
})

router.delete("/deleteitem/:itemId",async (req,res)=>{
  try {
    let restaurant = await restaurantModel.findOne({_id:req.user.id},{_id:1})
    if(!restaurant) return res.status(400).json({msg:"User not found"})
    await menuModel.deleteOne({_id:req.params.itemId})
    res.status(200).json({msg:"Item deleted in menu successfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})
  }
})

router.get("/getmenu", async (req,res)=>{
  try {
    let restaurant = await restaurantModel.findOne({_id:req.user.id},{_id:1})
    if(!restaurant) return res.status(400).json({msg:"User not found"})
    let menu = await menuModel.find({restaurant_id:restaurant._id},{_id:0,itemName:1,itemPrice:1})
    res.status(200).json(menu)
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})
  }
})

router.get("/restaurant-details",async (req,res)=>{
  try {
    let restaurant = await restaurantModel.findOne({_id:req.user.id})
    if(!restaurant) return res.status(400).json({msg:"Access denied"})
    let details = await restaurantModel.findOne({_id:req.user.id},{restaurantName: 1,location : 1,_id : 0})
    res.status(200).json({msg : details})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})

router.put("/restaurant-update", async (req, res) => {
  try {
    let restaurant = await restaurantModel.findOne({_id:req.user.id})
    if(!restaurant) return res.status(400).json({msg:"Access denied"})
    let userInput = req.body;
    await restaurantModel.updateOne(
      { _id: req.user.id },
      { $set: userInput },
      { new: true }
    );
    res.status(200).json({ msg: "restaurant details updated sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/restaurant-delete", async (req, res) => {
  try {
    let restaurant = await restaurantModel.findOne({_id:req.user.id})
    if(!restaurant) return res.status(400).json({msg:"Access denied"})
    await restaurantModel.updateOne(
      { _id: req.user.id },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "restaurant deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/prevorders",async (req,res)=>{
  try {
    let restaurant = await restaurantModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!restaurant) return res.status(400).json({ msg: "user not found" });
    let orders = await saleModel.find({restaurantId:req.user.id,"orderDetails.orderStatus":"finished"})
    res.status(200).json({orders})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
})

router.get("/offline",async(req,res)=>{
  try {
    let restaurant = await restaurantModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!restaurant) return res.status(400).json({ msg: "Access denied" });
    await restaurantModel.updateOne({_id: req.user.id},{$set:{isOnline:false}})
    res.status(200).json({msg:"You are now offline"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
})

export default router;