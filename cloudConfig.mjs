import { v2 as cloudinary } from "cloudinary";
import CloudinaryStoragePkg from "multer-storage-cloudinary";
const CloudinaryStorage = CloudinaryStoragePkg.default || CloudinaryStoragePkg;
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
}); 

// Configure Cloudinary Storage
const storage = CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust_Dev", 
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});



export {
  cloudinary,
  storage,
};