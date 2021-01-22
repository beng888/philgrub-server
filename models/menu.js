import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter menu title"],
    minlength: [3, "Must be atleast 3 characters"],
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please enter menu category"],
    trim: true,
  },
  servings: {
    type: String,
    required: [true, "Please enter menu servings"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter menu price"],
    trim: true,
  },
  ingredients: {
    type: String,
    required: [true, "Please enter menu ingredients"],
    minlength: [3, "Must be atleast 3 characters"],
    trim: true,
  },
  contain: {
    type: String,
    trim: true,
  },
  mayContain: {
    type: String,
    trim: true,
  },
  image: {
    type: Object,
    required: [true, "Please select an image"],
  },
  captions: {
    type: Array,
    required: true,
    validate: [(value) => value.length > 0, "Please select a caption/s"],
  },
});

const Menu = mongoose.model("menu", menuSchema);

export default Menu;
