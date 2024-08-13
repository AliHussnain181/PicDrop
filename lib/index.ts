import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { existsSync, unlinkSync } from "fs";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

cloudinary.config({
  cloud_name: process.env.C_N,
  api_key: process.env.A_P,
  api_secret: process.env.A_S,
});

interface CloudinaryUploadResult {
  url: string;
  // Add other properties as needed from the Cloudinary response
}

export const UploadCloudinary = async (
  file: string
): Promise<CloudinaryUploadResult | null> => {
  try {
    const upload = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });

    // Ensure the file is deleted after the upload attempt
    if (existsSync(file)) {
      unlinkSync(file);
    }

    return upload;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    // Ensure the file is deleted in case of an error
    if (existsSync(file)) {
      unlinkSync(file);
    }

    return null;
  }
};

export const deleteCloudinaryImage = async (image: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(image);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Cloudinary delete failed:", (error as Error).message);
  }
};
