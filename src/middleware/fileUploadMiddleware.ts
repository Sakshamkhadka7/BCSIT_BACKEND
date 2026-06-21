import multer from "multer";

const storage = multer.memoryStorage();

const uploadToCloudinary = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
});

export default uploadToCloudinary;
