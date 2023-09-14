import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    storename: {
        type: String,
    },
    date: {
        type: Date,
    },
    storetoken: {
        type: String,
    },
    onboarding: {
        type: Boolean,
    },
    appStatus: {
        type: Boolean,
    },
    sub: {
        type: Object,
    },
    html: {
        type: String,
    },
    design: {
        type: Object,
    },
    productId: {
        type: String,
    },
    password: {
        type: String,
    },
});

export default mongoose.model("store", storeSchema);
