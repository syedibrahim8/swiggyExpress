import express from "express";
import dotenv from "dotenv";
import "./utils/dbConnect.js";
import userRouter from "./controllers/public/customer.js";
import restaurantRouter from "./controllers/public/restaurant.js";
import authMiddleware from "./middleware/auth.js";
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
app.use(authMiddleware)

app.listen(port,()=>console.log(`Server is running at http://localhost:${port}`))
