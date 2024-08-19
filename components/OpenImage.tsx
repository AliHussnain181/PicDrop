"use client";
import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define the expected response type
interface ImageData {
  id: string;
  imgurl: string;
  role: string;
}

interface OpenImageProps {
  id: string;
  initialData: ImageData;
}

// Fetch function for React Query
const fetchImageData = async (id: string): Promise<ImageData> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/open/${id}`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch image data');
  }
  return res.data;
};

const OpenImage: React.FC<OpenImageProps> = ({ id, initialData }) => {
  const { data, error, isLoading } = useQuery<ImageData, Error>({
    queryKey: ['imageData', id],
    queryFn: () => fetchImageData(id),
    initialData, // Provide initial data for faster rendering
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const router = useRouter();

  // Handle navigation
  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center text-white">
          <div className="spinner"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <p className="text-lg mb-4">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <button onClick={handleBack} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900">
      <div className="lg:w-4/5 flex items-center justify-center p-4">
        {data?.imgurl ? (
          <div className="relative w-full h-full max-w-full max-h-full">
            <Image
              src={data.imgurl}
              alt="Uploaded Image"
              layout="fill"
              objectFit="contain" // Ensures the image fits within the container while preserving aspect ratio
              className="rounded-lg"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="p-8 text-center text-gray-700">
            <p className="text-lg">No image available</p>
          </div>
        )}
      </div>
      <div className="lg:w-1/5 flex items-center justify-center bg-gray-800 p-4 lg:p-8">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Image Details</h2>
          <p className="text-lg mb-2">ID: {data.id}</p>
          <p className="text-lg mb-4">Role: {data.role}</p>
          <button onClick={handleBack} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Back to Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenImage;
