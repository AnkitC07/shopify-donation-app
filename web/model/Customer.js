import mongoose from "mongoose";

const Customer = new mongoose.Schema({
    storename: String,
    customerId: String,
    address: String,
    products: Object,
    createdAt: Date,
})

export default mongoose.model("Customer", Customer);