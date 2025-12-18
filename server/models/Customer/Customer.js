import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        require:true,
        unique:true,
        trim:true,
    },
    gender:{
        type:String,
        enum:["male","female","others"],
        require:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
        minlength:[12,"Atleat 12"],
        maxlength:[70,"Max age 70"]
    },
    address:{
        type:String,
        require:true,
        trim:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isVerified:{
        email:{
            type:Boolean,
            default:false
        },
        phone:{
            type:Boolean,
            default:false
        }
    },
    verifyToken:{
        emailToken:{
            type:String,
            default:null
        },
        phoneToken:{
            type:String,
            default:null
        }
    }
},{
    timestamps:true,
    strict:false
})

const customerModel = mongoose.model("customers",customerSchema)

export default customerModel