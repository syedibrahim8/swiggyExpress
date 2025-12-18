import express from "express";
const router = express.Router();
import riderModel from "../../models/Riders/riders.js";
import saleModel from "../../models/Sales/Sales.js";


router.get("/rider-details",async (req,res)=>{
    try {
      let rider = await riderModel.findOne({_id:req.user.id},{fullName:1,"vehicle.type": 1,vehicleType : 1,_id : 0})
      if (!rider) return res.status(400).json({ msg: "user not found" });
      res.status(200).json({msg : user})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})

router.put("/rider-update", async (req, res) => {
  try {
    let rider = await riderModel.findOne({ _id: req.user.id }, { _id: 1 });
      if (!rider) return res.status(400).json({ msg: "user not found" });
    let userInput = req.body;
    await riderModel.updateOne(
      { _id : req.user.id },
      { $set: userInput },
      { new: true }
    );
    res.status(200).json({ msg: "user updated sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/rider-delete", async (req, res) => {
  try {
    let rider = await riderModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!rider) return res.status(400).json({ msg: "user not found" });
    await riderModel.updateOne(
      { _id : req.user.id },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "rider deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/prevorders",async (req,res)=>{
  try {
    let rider = await riderModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!rider) return res.status(400).json({ msg: "user not found" });
    let orders = await saleModel.find({riderId:req.user.id,"orderDetails.orderStatus":"finished"})
    res.status(200).json({orders})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
})

router.get("/orderstatusupd/:orderid",async(req,res)=>{
  try {
    let rider = await riderModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!rider) return res.status(400).json({ msg: "user not found" });
    await saleModel.updateOne({riderId:req.user.id,_id:req.params.orderid},{$set:{"orderDetails.orderStatus":"finished"}})
    res.status(200).json({msg:"Order completed"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
})

router.get("/offline",async(req,res)=>{
  try {
    let rider = await riderModel.findOne({ _id: req.user.id }, { _id: 1 });
    if (!rider) return res.status(400).json({ msg: "user not found" });
    await riderModel.updateOne({_id: req.user.id},{$set:{isOnline:false}})
    res.status(200).json({msg:"You are now offline"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
})

export default router