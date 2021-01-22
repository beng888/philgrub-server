import cloudinary from "cloudinary";

import ImageSchema from "../models/fileUpload.js";

export const UploadImage = async (req, res) => {
  // console.log(req);
  const imageUploaded = new ImageSchema({
    image_path: req.file.path,
    cloudinary_id: req.file.filename,
    originalname: req.file.originalname,
  });

  try {
    await imageUploaded.save();
    res.json(imageUploaded);
    console.log(req.file);
  } catch (error) {
    return res.status(400).json({
      message: `image upload failed, check to see the ${error}`,
      status: "error",
    });
  }
};

export const DeleteImage = async (req, res) => {
  console.log(req.body.image);
  try {
    const public_id = req.body.image.cloudinary_id;
    const image_id = req.body.image._id;
    console.log(public_id);

    let image = await ImageSchema.findById(image_id);

    if (!public_id) return res.status(400).json({ msg: "No images Selected" });
    await cloudinary.v2.uploader.destroy(
      public_id
      // { invalidate: true, resource_type: "image" },
      // async (err, result) => {
      //   if (err) throw err;
      //   console.log(result);
      // }
    );
    await image.remove();
    res.json({ msg: "Image Deleted" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
