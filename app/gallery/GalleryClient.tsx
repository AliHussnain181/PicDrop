// app/gallery/GalleryClient.tsx
"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';

type ImageType = {
  id: number;
  imgurl: string;
};

const fetchImages = async (): Promise<ImageType[]> => {
  const res = await axios.get('/api/data'); // Update the API endpoint as needed
  return res.data;
};

export default function GalleryClient() {
  const { data: images = [], error, isLoading } = useQuery<ImageType[]>({
    queryKey: ['images'],
    queryFn: fetchImages,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading images: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Image
            className="w-full h-60 object-fill"
            src={image.imgurl}
            alt={`Image ${image.id}`}
            width={1000}
            height={1000}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-lg font-semibold">Check</p>
          </div>
        </div>
      ))}
    </div>
  );
}
