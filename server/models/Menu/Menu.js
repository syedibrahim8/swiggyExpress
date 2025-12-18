import mongoose from "mongoose"

const menuSchema = new mongoose.Schema({
    restaurant_id:{
        type:String,
        require:true
    },
    itemName:{
        type:String,
        require:true,
        trim:true,
    },
    itemPrice:{
        type:Number,
        require:true,
        trim:true,
    },
    category:{
        type:String,
        require:true,
        trim:true,
        enum:["non-veg","veg","fastfood","bevarages"]
    }
},{
    timestamps:true,
    strict:false
})

const menuModel = mongoose.model("menu",menuSchema)

export default menuModel