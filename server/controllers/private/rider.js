import express from "express";
const router = express.Router();
import riderModel from "../../models/Riders/riders.js";


router.get("/rider-details",async (req,res)=>{
    try {
        let user = req.user
        let details = await riderModel.findOne({email : user.email},{fullName:1,"vehicle.type": 1,vehicleType : 1,_id : 0})

        res.status(200).json({msg : details})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
router.put("/rider-update", async (req, res) => {
  try {
    let user = req.user
    let userInput = req.body;
    await riderModel.updateOne(
      { email: user.email },
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
    let user = req.user;
    await riderModel.updateOne(
      { email: user.email },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "rider deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
export default router