import mongoose from "mongoose";

import Message from "../models/message.js";
import { handleErrors } from "../utils/DBError.js";

export const createMessage = async (req, res) => {
  const message = req.body;

  const newMessage = new Message(message);

  try {
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    const errors = handleErrors(error);
    console.log(error);
    res.status(401).json({ errors });
  }
};

export const getMessage = async (req, res) => {
  try {
    const message = await Message.find();

    res.status(200).json(message);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Message.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};
