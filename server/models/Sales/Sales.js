import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  restaurantId: {
    type: String,
    require: true,
  },
  riderId: {
    type: String,
    require: true,
  },
  orderDetails: {
    itemName: {
      type: String,
      require: true,
    },
    itemPrice: {
      type: Number,
      require: true,
    },
    itemQty: {
      type: Number,
      require: true,
      minlength: [1, "Quantity must be atleast 1"],
      maxlength: [15, "Maximum Quantity can be ordered is 15"],
    },
    total:{
      type:Number,
      require:true
    },
    paymentMethod:{
        type:String,
        enum:["cod","upi","card"]
    },
    orderStatus: {
      type: String,
      enum:["finished","on-the-way"],
      default:"on-the-way"
    },
  },
},{
    timestamps:true,
    strict:false
});

const saleModel = mongoose.model("sales",salesSchema)
export default saleModel;