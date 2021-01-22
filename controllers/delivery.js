import mongoose from "mongoose";

import Delivery from "../models/delivery.js";
import { handleErrors } from "../utils/DBError.js";

export const createDelivery = async (req, res) => {
  const delivery = req.body;

  const newDelivery = new Delivery(delivery);

  try {
    await newDelivery.save();

    res.status(201).json(newDelivery);
  } catch (error) {
    const errors = handleErrors(error);
    console.log(error);
    res.status(401).json({ errors });
  }
};

export const getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.find();

    res.status(200).json(delivery);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteDelivery = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No postal code with id: ${id}`);

  await Delivery.findByIdAndRemove(id);

  res.json({ message: "Postal code deleted successfully." });
};
