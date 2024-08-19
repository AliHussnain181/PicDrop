"use client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState, ChangeEvent, useCallback, useRef, useMemo } from "react";

// Define the expected response type
type UploadResponse = {
  success: boolean;
  message: string;
};

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const uploadMutation: UseMutationResult<UploadResponse, Error, File> =
    useMutation({
      mutationFn: async (file: File) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status !== 200) {
          throw new Error("File upload failed");
        }

        return res.data as UploadResponse;
      },
      onSuccess: (data) => {
        setFeedbackMessage(`File uploaded successfully: ${data.message}`);
        setSelectedFile(null);
        setPreview(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        const clearThis = setTimeout(() => {
          setFeedbackMessage(null);
        }, 3000);
        clearTimeout(clearThis);
        setIsLoading(false);
      },
      onError: (error) => {
        setFeedbackMessage(
          `Error uploading file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setIsLoading(false);
      },
    });

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file && file.size > maxFileSize) {
        setFeedbackMessage(
          "File size exceeds 5MB. Please choose a smaller file."
        );
        return;
      }
    
      setSelectedFile(file);
      setPreview(file ? URL.createObjectURL(file) : null);
    }, [maxFileSize]);
    
  const handleUpload = useCallback(() => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  }, [selectedFile, uploadMutation]);

  const filePreview = useMemo(() => {
    return (
      preview && (
        <div className="mt-6 text-center">
          <Image
            className="mx-auto h-40 w-40 rounded-md object-cover"
            src={preview}
            alt="Preview"
            width={160} // Set appropriate width
            height={160} // Set appropriate height
            layout="intrinsic" // Or use 'responsive' based on your needs
          />
        </div>
      )
    );
  }, [preview]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Upload Your Image
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Share your favorite images with the community
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="file-upload" className="sr-only">
                Choose File
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                accept="image/*"
                aria-describedby="file-upload-help"
              />
              <small id="file-upload-help" className="text-gray-500">
                File size should not exceed 5MB.
              </small>
            </div>
          </div>

          {filePreview}

          <div>
            <button
              type="button"
              onClick={handleUpload}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading || !selectedFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={isLoading || !selectedFile}
              aria-busy={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Image"}
              {isLoading && (
                <svg
                  className="animate-spin ml-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
            </button>
            {feedbackMessage && (
              <p
                className={`mt-2 text-center ${
                  uploadMutation.isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {feedbackMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
