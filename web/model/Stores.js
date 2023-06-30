import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  storename: {
    type: String,
  },
  storetoken: {
    type: String,
  },
  onboarding: {
    type: Boolean
  },
  appStatus: {
    type: Boolean
  },
  sub: {
    type: Object
  }

});

export default mongoose.model("store", storeSchema);