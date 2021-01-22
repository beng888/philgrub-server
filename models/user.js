import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { billingAddressSchema } from "./billingAddress.js";
import { shippingAddressSchema } from "./shippingAddress.js";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    minlength: [3, "Must be atleast 3 characters"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
    select: false,
  },
  currentPassword: {
    type: String,
    minlength: [6, "Minimum password length is 6 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  checkout: {
    type: Object,
    default: {},
  },
  stripeId: {
    type: String,
    default: "",
  },
  orders: {
    type: Array,
    default: [],
  },
  billingAddress: billingAddressSchema,
  shippingAddress: shippingAddressSchema,

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  if (!this.isModified("currentPassword")) {
    next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

  return resetToken;
};

const User = mongoose.model("user", userSchema);

export default User;
