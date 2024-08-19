"use client"; // Ensure this is a client component

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";

// Update the image with the new file
const updateImage = async (formData: FormData) => {
  try {
    const response = await axios.put("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update image. Please try again.");
  }
};

const ImageUpdatePage = () => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  // Extract URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const imgurl = urlParams.get("imgurl");
    const imgId = urlParams.get("id");
    if (imgurl && imgId) {
      setImageUrl(decodeURIComponent(imgurl));
      setImageId(imgId);
    }
  }, []);

  const mutation = useMutation({
    mutationFn: updateImage,
    onSuccess: () => {
      setMessage("Image updated successfully!");
      router.push("/"); // Redirect after update
    },
    onError: (error: Error) => {
      setMessage(error.message || "An error occurred");
    },
  });

  const handleNewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setNewImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewImagePreview(previewUrl);
    } else {
      setNewImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newImage) {
      setMessage("Please select a new image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", newImage);
    formData.append("id", imageId || "");
    formData.append("oldImgUrl", imageUrl || ""); // Use existing image URL

    mutation.mutate(formData);
  };

  if (!imageUrl) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Your Image</h2>
      <div className="mb-6">
        <Image
          className="w-full h-64 object-cover rounded-lg border border-gray-300"
          src={newImagePreview || imageUrl}
          alt="Current Image"
          width={1000}
          height={1000}
          loading="lazy"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="newImage" className="text-gray-700 font-semibold mb-2">
            Select New Image
          </label>
          <input
            type="file"
            id="newImage"
            onChange={handleNewImageChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Updating..." : "Update Image"}
        </button>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default ImageUpdatePage;
