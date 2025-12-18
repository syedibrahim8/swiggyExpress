import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
    riderName:{
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
    phone:{
        type:String,
        require:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    vehicle:{
        type:{
        type:String,
        enum:["bike","scooty"]
        },
        liscence:{
            type:String,
            trim:true,
            uppercase:true,
            unique:true
        }
    },
    gender:{
        type:String,
        enum:["male","Male"],
        require:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
        minlength:[18,"Atleat 12"],
        maxlength:[40,"Max age 70"]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isOnline:{
        type:Boolean,
        default:false
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

const riderModel = mongoose.model("riders",riderSchema)
export default riderModel;