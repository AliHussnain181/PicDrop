import React from 'react';
import axios from 'axios';
import { notFound } from 'next/navigation';
import OpenImage from '@/components/OpenImage'; // Adjust the import path

// Define the expected response type
interface ImageData {
  id: string;
  imgurl: string;
  role: string;
}

// Fetch function for server-side rendering
const fetchImageData = async (id: string): Promise<ImageData> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/open/${id}`);
  if (res.status !== 200) {
    throw new Error('Failed to fetch image data');
  }
  return res.data;
};

// Server-side component
const Page: React.FC<{ params: { id: string } }> = async ({ params }) => {
  try {
    const data = await fetchImageData(params.id);
    return <OpenImage initialData={data} id={params.id} />;
  } catch (error) {
    // Optionally handle errors by returning a 404 page or some other fallback
    notFound();
    return null;
  }
};

export default Page;
