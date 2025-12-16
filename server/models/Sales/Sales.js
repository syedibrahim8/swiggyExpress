import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  userID: {
    type: String,
    require: true,
  },
  RestaurantId: {
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
    paymentMethod:{
        type:String,
        enum:["cod","upi","card"]
    },
    orderStatus: {
      type: Boolean,
      default: false,
    },
  },
},{
    timestamps:true,
    strict:false
});

const saleModel = mongoose.model("sales",salesSchema)
export default saleModel;