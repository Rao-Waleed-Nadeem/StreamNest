import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) {
      console.log("Uploading file is empty");
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    console.log("Error in uploading file: ", localFilePath);
    return null;
  }
};

const deleteImageFromCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) {
      console.log("Deleting file is empty");
      return null;
    }
    const response = await cloudinary.uploader.destroy(localFilePath, {
      resource_type: "image",
    });
    return response;
  } catch (err) {
    console.log("Error in Deleting file: ", localFilePath);
    return null;
  }
};

const deleteVideoFromCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) {
      console.log("Deleting file is empty");
      return null;
    }
    const response = await cloudinary.uploader.destroy(localFilePath, {
      resource_type: "video",
    });
    return response;
  } catch (err) {
    console.log("Error in Deleting file: ", localFilePath);
    return null;
  }
};

export {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
  deleteVideoFromCloudinary,
};
