import express from "express";
import dotenv from "dotenv";
import "./utils/dbConnect.js";
import userRouter from "./controllers/public/customer.js";
import restaurantRouter from "./controllers/public/restaurant.js";
import riderRouter from "./controllers/public/rider.js";
import authMiddleware from "./middleware/auth.js";
import restaurantPrivateRouter from "./controllers/private/restaurant.js"
import userPrivateRouter from "./controllers/private/customer.js"
dotenv.config();

const port = process.env.PORT 
const app = express();
app.use(express.json())

app.get("/",(req,res)=>{
    try {
        res.status(200).json({msg:"Welcome"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
})

app.use("/user",userRouter)
app.use("/restaurant",restaurantRouter)
app.use("/rider",riderRouter)
app.use(authMiddleware)
app.use("/customerPrivate",userPrivateRouter)
app.use("/restaurantPrivate",restaurantPrivateRouter)

app.listen(port,()=>console.log(`Server is running at http://localhost:${port}`))
