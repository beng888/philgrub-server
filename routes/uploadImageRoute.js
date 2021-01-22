import express from "express";

import { UploadImage, DeleteImage } from "../controllers/uploadImage.js";
import { parser } from "../middleware/cloudinary.config.js";
import { secure, clearanceLevel } from "../middleware/auth.js";

const Router = express.Router();

Router.use(secure);
Router.use(clearanceLevel("admin"));

Router.post("/image", parser.single("image"), UploadImage);
Router.post("/destroy", DeleteImage);

export default Router;
