import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shop: String,
  date: Date,
  totalCount: Number,
  totalCo2: Number,
  totalAmount: Number,
  totalFee: Number,
  orders: [
    {
      co2Added: Number,
      amountAdded: Number,
      feeAdded: Number,
      orderDate: Date,
    },
  ],
});

export default mongoose.model("Order", orderSchema);
