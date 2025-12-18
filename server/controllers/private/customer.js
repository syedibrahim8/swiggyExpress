import express from "express";
import customerModel from "../../models/Customer/Customer.js";
import restaurantModel from "../../models/Restaurant/Restaurant.js";
import menuModel from "../../models/Menu/Menu.js";
import saleModel from "../../models/Sales/Sales.js";
import riderModel from "../../models/Rider/Rider.js";

const router = express.Router();

router.get("/user-profile", async (req, res) => {
  try {
    let user = await customerModel.findOne(
      { _id: req.user.id },
      {
        name: 1,
        email: 1,
        phone: 1,
        _id: 0,
        address: 1,
        isActive: 1,
      }
    );
    if (!user)
      return res.status(400).json({ msg: "user not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
});

router.put("/updatecustomer", async (req, res) => {
  try {
    let user = await customerModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!user)
      return res.status(400).json({ msg: "user not found" });
    let updatedData = req.body;
    await customerModel.updateOne(
      { _id: req.user.id },
      {
        $set: updatedData,
      }
    );
    res.status(200).json({ msg: "Account updated successfully!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
});

router.delete("/deletecustomer", async (req, res) => {
  try {
    let user = await customerModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!user)
      return res.status(400).json({ msg: "user not found" });
    await customerModel.updateOne(
      { _id: req.user.id },
      { $set: { isActive: false } }
    );
    res
      .status(200)
      .json({ msg: "Your account was deleted successfully. Farewell!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error });
  }
});

router.post("/getrestaurantbyfood", async (req, res) => {
  try {
    let {itemName} = req.body
    const menu = await menuModel.find({itemName});
    let ids = menu.map((x)=>x.restaurant_id)
    const restaurant = await restaurantModel.find({_id:{$in:ids}},{restaurantName:1,location:1,isOpen:1,_id:0})
    res.status(200).json({ restaurant });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/order", async (req, res) => {
  try {
    let user = await customerModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!user) return res.status(400).json({ msg: "Access denied" });
    let { itemName, qty, method, restaurant } = req.body;
    let resta = await restaurantModel.findOne(
      { restaurantName: restaurant, isOpen: true },
      { _id: 1 }
    );
    if (!resta)
      return res.status(400).json({ msg: "Your given restaurant is closed" });
    let itemAvail = await menuModel.findOne(
      { itemName, restaurant_id: resta._id },
      { itemPrice: 1 }
    );
    if (!itemAvail) return res.status(400).json({ msg: "Item Not available" });
    let riderAvail = await riderModel.findOne({ isOnline: true }, { _id: 1 });
    if(!riderAvail) return res.status(400).json({msg:"Please wait for a while"})
    let orderPayload = {
      userId: req.user.id,
      restaurantId: resta._id,
      riderId: riderAvail._id,
      orderDetails: {
        itemName,
        itemPrice: itemAvail.itemPrice,
        itemQty: qty,
        total: itemAvail.itemPrice * qty,
        paymentMethod: method,
      },
    };
    await saleModel.insertOne(orderPayload);
    res.status(200).json({ msg: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/prevorders",async (req,res)=>{
  try {
    let customer = await customerModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!customer) return res.status(400).json({ msg: "user not found" });
    let orders = await saleModel.find({userId:req.user.id,"orderDetails.orderStatus":"finished"})
    res.status(200).json({orders})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
})

export default router;

// let {itemName,qty,method,restaurant} = req.body
// let itemAvail = await menuModel.find({itemName},{restaurant_id:1,_id:0,itemPrice:1})
// if(!itemAvail) return res.status(400).json({msg:"Item Not available"})
// let resta = await restaurantModel.findOne({restaurantName:restaurant,isOpen:true},{_id:1})
// if(!resta) return res.status(400).json({msg:"Your given restaurant is closed"})
// let available = itemAvail.find((x)=>x.restaurant_id == resta._id)
// if(!available) return res.status(400).json({msg:"Your given restaurant doesnt have your food item"})
// let riderAvail = await riderModel.findOne({isOnline:true},({_id:1}))
// let orderPayload={
//     userId:req.user.id,
//     restaurantId:available.restaurant_id,
//     riderId:riderAvail._id,
//     orderDetails:{
//         itemName,
//         itemPrice:available.itemPrice,
//         itemQty:qty,
//         total:available.itemPrice * qty,
//         paymentMethod:method
//     }
// }
// await saleModel.insertOne(orderPayload)
