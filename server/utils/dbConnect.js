import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function dbConnect(){
    try {
        let dbUri = process.env.DBURI
        console.log(dbUri);
        await mongoose.connect(dbUri)
        console.log("DB Connected...");
    } catch (error) {
        console.log(error);
    }
}
dbConnect()