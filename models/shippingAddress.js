import mongoose from "mongoose";

export const shippingAddressSchema = new mongoose.Schema({
  shipping_firstName: {
    type: String,
    required: [true, "Please enter you first name"],
  },
  shipping_lastName: {
    type: String,
    required: [true, "Please enter you last name"],
  },
  shipping_companyName: {
    type: String,
  },
  shipping_houseAddress: {
    type: String,
    required: [true, "Please enter your House/Street Address"],
  },
  shipping_apartmentAddress: {
    type: String,
  },
  shipping_townCity: {
    type: String,
    required: [true, "Please enter your House/Street Address"],
  },
  shipping_postalCode: {
    type: String,
    required: [true, "Please enter your Postal Code"],
  },
});

const ShippingAddress = mongoose.model(
  "ShippingAddress",
  shippingAddressSchema
);

export default ShippingAddress;
