import mongoose from "mongoose";
import cloudinary from "cloudinary";

import Menu from "../models/menu.js";
import ImageSchema from "../models/fileUpload.js";
import { handleErrors } from "../utils/DBError.js";

export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();

    res.status(200).json(menu);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createMenu = async (req, res) => {
  const menu = req.body;

  const newMenu = new Menu(menu);

  try {
    await newMenu.save();

    res.status(201).json(newMenu);
  } catch (error) {
    const errors = handleErrors(error);
    console.log(errors);
    res.status(401).json({ errors });
  }
};

export const deleteMenu = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No menu with that id");

  let menu = await Menu.findById(id);
  await cloudinary.v2.uploader.destroy(menu.image.cloudinary_id);
  await ImageSchema.findByIdAndRemove(menu.image._id);
  await menu.remove();

  res.json({ message: "Menu deleted successfully" });
};

export const updateMenu = async (req, res) => {
  const { id: _id } = req.params;
  const menu = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No menu with that id");

  const updateMenu = await Menu.findByIdAndUpdate(
    _id,
    { ...menu, _id },
    {
      new: true,
      runValidators: true,
    },
    (err, menu) => {
      if (err) {
        const errors = handleErrors(err);
        console.log(errors);
        return res.status(400).json({ errors });
      }

      // return res.status(200).json(menu);
    }
  );

  res.json(updateMenu);
};
