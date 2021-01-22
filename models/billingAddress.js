import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";

export const billingAddressSchema = new mongoose.Schema({
  billing_firstName: {
    type: String,
    required: [true, "Please enter you first name"],
  },
  billing_lastName: {
    type: String,
    required: [true, "Please enter you last name"],
  },
  billing_companyName: {
    type: String,
  },
  billing_houseAddress: {
    type: String,
    required: [true, "Please enter your House/Street Address"],
    minlength: [20, "Minimum of 20 characters"],
  },
  billing_apartmentAddress: {
    type: String,
  },
  billing_townCity: {
    type: String,
    required: [true, "Please enter your House/Street Address"],
  },
  billing_postalCode: {
    type: String,
    required: [true, "Please enter your Postal Code"],
  },
  billing_phone: {
    type: String,
    required: [true, "Please enter your contact number"],
    minlength: [11, "Minimum of 11 numbers"],
    maxlength: [11, "Maximum of 11 numbers"],
  },
  billing_email: {
    type: String,
    required: [true, "Please enter an email"],
    validate: [isEmail, "Please enter a valid email"],
  },
});

const BillingAddress = mongoose.model("BillingAddress", billingAddressSchema);

export default BillingAddress;
