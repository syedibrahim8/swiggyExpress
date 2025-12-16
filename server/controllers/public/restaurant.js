import express from "express";
import restaurantModel from "../../models/Restaurant/Restaurant.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import mail from "../../utils/mailer.js";
import sendSms from "../../utils/sms.js";
dotenv.config();
const port = process.env.PORT;

const router = express.Router()
router.post("/register", async (req, res) => {
  try {
    let { restaurantName, location, email, phone, password, menu } = req.body;
    let user = await restaurantModel.findOne({ $or: [{ email }, { phone }] });
    if (user)
      return res
        .status(400)
        .json({ msg: "Restaurant already exist with this info" });
    password = await bcrypt.hash(password, 10);
    const eToken = Math.random().toString(36).slice(2, 10);
    const pToken = Math.random().toString(36).slice(2, 10);
    const eLink = `http://localhost:${port}/restaurant/verify-email/${eToken}`;
    const pLink = `http://localhost:${port}/restaurant/verify-phone/${pToken}`;
    const dbPayload = {
      restaurantName,
      email,
      password,
      phone,
      location,
      menu,
      verifyToken: {
        emailToken: eToken,
        phoneToken: pToken,
      },
    };
    await restaurantModel.insertOne(dbPayload);
    await mail(
      email,
      `Welcome to Swiggy, Glad to have your Restaurant on board`,
      `Your account is successfully registered with us please verify your email with given link ${eLink}`
    );
    await sendSms(
      phone,
      `Welcome ${restaurantName}!\nPlease verify your mobile linked to swiggy restaurant account ${pLink}`
    );
    res.status(201).json({
      msg: "Restaurant account created successfully, verify your email and phone to continue",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verify-email/:emailToken", async (req, res) => {
  try {
    let eToken = req.params.emailToken;
    if (!eToken) return res.status(400).json({ msg: "Invalid Token" });
    await restaurantModel.updateOne(
      { "verifyToken.emailToken": eToken },
      { $set: { "isVerified.email": true, "verifyToken.emailToken": null } },
      { new: true }
    );
    res.status(200).json({ msg: "Email address is now verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verify-phone/:phoneToken", async (req, res) => {
  try {
    let pToken = req.params.phoneToken;
    let user = await restaurantModel.findOne({
      "verifyToken.phoneToken": pToken,
    });
    if (!user) return res.status(400).json({ msg: "Invalid user or link" });
    await restaurantModel.updateOne(
      { "verifyToken.phoneToken": pToken },
      { $set: { "isVerified.phone": true, "verifyToken.phoneToken": null } },
      { new: true }
    );
    res.status(200).json({ msg: "Your mobile number is now verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let restaurant = await restaurantModel.findOne({$and:[{email},{role:"Restaurant"}]});
    if (!restaurant)
      return res
        .status(400)
        .json({ msg: "Restaurant not found, Access denied!" });

    if (!restaurant.isVerified.email && !restaurant.isVerified.phone)
      return res
        .status(400)
        .json({ msg: "Account is not verified. Verify it first" });

    let pass = await bcrypt.compare(password, restaurant.password);
    if (!pass) return res.status(400).json({ msg: "Invalid Credentials" });

    let payload = {
      id: restaurant._id,
      role: restaurant.role
    };

    const token = jwt.sign(payload, process.env.SEC_KEY, { expiresIn: "1d" });
    await restaurantModel.updateOne({email},{$set:{isOpen:true}})
    res.status(200).json({ msg: "Login successfull", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/forgot-password",async (req,res)=>{
  try {
    let {email} = req.body
    let user = await restaurantModel.findOne({$and:[{email},{role:"Restaurant"}]})
    if(!user){
        return res.status(400).json({msg:"User not found"})
    }
    let tempPassword = Math.random().toString(36).slice(1,10)
    let otp = Math.floor(Math.random()*(99999-1000)+1000)
    let pass = await bcrypt.hash(tempPassword,10)
    await restaurantModel.updateOne({email},{$set:{password:pass,otp}},{new:true})
    await mail(user.email,
        `Update Password of your swiggy account`,
        `Hey ${user.fullName}! we got a request for changing account password \nHere is the OTP:${otp} and link http://localhost:${port}/restaurant/change-password to change your password or you can either login with\nTemporary Password ${tempPassword} and update it later `)
    res.status(200).json({msg:"email sent to change password"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})      
  }
})

router.post("/change-password",async(req,res)=>{
  try {
    let {email,otp,password} = req.body;
    let user = await restaurantModel.findOne({$and:[{email},{otp}]})
    if(!user) return res.status(400).json({msg:"Invalid OTP or User"}) 
    let pass = await bcrypt.hash(password, 10);
    await restaurantModel.updateOne({otp},{$set:{password:pass},$unset:{otp:""}},{new:true})
    res.status(200).json({msg:"Password changed"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})     
  }
})

export default router;