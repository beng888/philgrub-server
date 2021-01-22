import multer from "multer";

// const multer = require("multer");

import cloudinary from "cloudinary";

import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_HOST,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "philgrub",
    // format: async () => "png",
    eager: [
      { fetch_format: "wdp", format: "" },
      { fetch_format: "jp2", format: "" },
      { fetch_format: "webp", format: "" },
    ],
    public_id: (req, file) => file.filename,
  },
});

export const parser = multer({ storage: storage });
