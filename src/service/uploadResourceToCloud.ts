import { envConfig } from "../config/envConfig";
import cloudinary from "../config/cloudinary";
import stremifier from "streamifier";
import { Request } from "express";
import { UploadApiResponse } from "cloudinary";

const uploadResource = (req: Request): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "bcsit-hub",
        resource_type:"auto"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        } else {
          if (!result) {
            reject(new Error("Cloudinary upload failed"));
            return;
          } else {
            resolve(result);
          }
        }
      },
    );

    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) {
      reject(new Error("No file provided"));
      return;
    }

    stremifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default uploadResource;
