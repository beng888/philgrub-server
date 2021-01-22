import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, "Please enter location name"],
    trim: true,
    unique: true,
  },
  postal: {
    type: String,
    required: [true, "Please include the Postal code"],
    trim: true,
    unique: true,
  },
});

const Delivery = mongoose.model("delivery", deliverySchema);

export default Delivery;
