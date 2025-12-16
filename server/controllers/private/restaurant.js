import express from "express";
import restaurantModel from "../../models/Restaurant/Restaurant.js";
import saleModel from "../../models/Sales/Sales.js";

const router = express.Router()

router.post("/addmenu",async (req,res)=>{
    try {
        let user = await restaurantModel.findOne({_id:req.user.id})
        if(!user) return res.status(400).json({msg:"User not found"})
        let userInput = req.body
        await restaurantModel.updateOne({_id:req.user.id},{$push:{menu:userInput}},{new:true})
        res.status(200).json({msg:"Item added to menu"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error}) 
    }
})

router.get("/restaurant-details",async (req,res)=>{
    try {
        let user = req.user
        let details = await restaurantModel.findOne({email : user.email},{restaurantName: 1,restaurantaddress : 1,_id : 0})

        res.status(200).json({msg : details})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
router.put("/restaurant-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userInput = req.body;
    await restaurantModel.updateOne(
      { email: user.email },
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
    let user = await restaurantModel.findOne({_id:req.user.id})
    if(!user) return res.status(400).json({msg:"Account not found"})
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

export default router;