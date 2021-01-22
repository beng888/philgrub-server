import mongoose from "mongoose";

const ImageUpload = new mongoose.Schema(
  {
    image_path: { type: String, required: true },
    cloudinary_id: { type: String, required: true },
    originalname: { type: String, required: true },
  },
  { timestamps: true }
);

const ImageSchema = mongoose.model("imageUpload", ImageUpload);

export default ImageSchema;
