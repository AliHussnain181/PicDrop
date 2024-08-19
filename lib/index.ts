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
    // console.log("Image deleted successfully");
  } catch (error) {
    console.error("Cloudinary delete failed:", (error as Error).message);
  }
};

export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // Ensure the URL is a valid string
    if (typeof url !== "string" || !url.trim()) {
      throw new Error("Invalid URL provided");
    }

    // Extract the public ID from the URL
    const urlSegments = url.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];

    // Validate if the last segment exists and contains a dot (.)
    if (!lastSegment || !lastSegment.includes('.')) {
      throw new Error("URL does not contain a valid public ID segment");
    }

    // Split the last segment to isolate the public ID (before the dot)
    const publicId = lastSegment.split('.')[0];

    // Ensure the public ID is not empty
    if (!publicId) {
      throw new Error("Failed to extract public ID from the URL");
    }

    return publicId;
  } catch (error) {
    console.error((error as Error).message);
    return null;
  }
};
