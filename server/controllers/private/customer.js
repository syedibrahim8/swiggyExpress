import express from "express";
import customerModel from "../../models/Customer/Customer.js";
import restaurantModel from "../../models/Restaurant/Restaurant.js";
import saleModel from "../../models/Sales/Sales.js";

const router = express.Router()

router.post("/getrestaurantbyfood", async (req,res)=>{
    try {
        let {item} = req.body
        let restaurants = await restaurantModel.find({"menu[itemName]":item},{_id:0,restaurantName:1,location:1,menu:1})
        res.status(200).json(restaurants)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
})

router.get("/user-profile", async (req, res)=>{
    try {
        let user = await customerModel.findOne({_id: req.user.id},{name: 1, email: 1, phone: 1, _id: 0, address: 1, orderHistory: 1, currentOrder: 1});
        if(!user) return res.status(400).json({msg:"User not found"})
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error.message});
    }
});

router.put("/updatecustomer", async (req, res)=>{
    try {
        let updatedData = req.body;
        await customerModel.updateOne({_id: req.user.id}, {
            $set: updatedData
        });
        res.status(200).json({msg: "Account updated successfully!"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error.message});
    }
});

router.delete("/deletecustomer", async (req, res)=>{
    try {
        await customerModel.updateOne({_id: req.user.id}, {$set: {isActive: false}});
        res.status(200).json({msg: "Your account was deleted successfully. Farewell!"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error});
    }
});

router.post("/order",async(req,res)=>{
    try {
        let {itemName,itemPrice,qty,method} = req.body
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg: error});   
    }
})

export default router