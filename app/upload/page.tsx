"use client";
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';
import { useState, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Define the expected response type
type UploadResponse = {
  success: boolean;
  message: string;
};

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const router = useRouter();
  // Use useMemo to prevent unnecessary re-creation of the mutation object
  const uploadMutation: UseMutationResult<UploadResponse, Error, File> = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status !== 200) {
        throw new Error('File upload failed');
      }

      return res.data as UploadResponse;
    },
    onSuccess: (data) => {
      setFeedbackMessage(`File uploaded successfully: ${data.message}`);
      router.push('/gallery');
    },
    onError: (error) => {
      setFeedbackMessage(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  // useCallback to memoize the function, preventing unnecessary re-renders
  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }, []);

  // Memoize the handleUpload function
  const handleUpload = useCallback(() => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  }, [selectedFile, uploadMutation]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                  onChange={handleFileChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  accept="image/*"
                />
              </div>
            </div>

            {preview && (
              <div className="mt-6 text-center">
                <img
                  className="mx-auto h-40 w-40 rounded-md object-cover"
                  src={preview}
                  alt="Preview"
                />
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={handleUpload}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={uploadMutation.isPending || !selectedFile}
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
              </button>
              {feedbackMessage && (
                <p className={`mt-2 text-center ${uploadMutation.isError ? 'text-red-600' : 'text-green-600'}`}>
                  {feedbackMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
