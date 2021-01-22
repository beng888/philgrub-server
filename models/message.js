import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";

const messageSchema = new mongoose.Schema({
  contact_name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  contact_email: {
    type: String,
    required: [true, "Please enter your email address"],
    validate: [isEmail, "Please enter a valid email"],
  },
  contact_phone: {
    type: String,
  },
  contact_subject: {
    type: String,
    required: [true, "Please enter the subject"],
    minlength: [3, "Must be atleast 3 characters"],
    maxlength: [20, "Must be below 20 characters"],
  },
  contact_message: {
    type: String,
    required: [true, "Please enter your message"],
    minlength: [20, "Must be atleast 20 characters"],
    maxlength: [200, "Must be below 200 characters"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Message = mongoose.model("message", messageSchema);

export default Message;
