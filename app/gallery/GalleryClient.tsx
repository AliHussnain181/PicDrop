"use client";
import React, { useState, useEffect, memo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  MutationFunction,
} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { MdDelete, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { FaHeart, FaPlus, FaDownload } from "react-icons/fa";

// Types
type ImageType = {
  id: number;
  imgurl: string;
};

// Fetch images with pagination support
const fetchImages = async (
  page: number,
  limit: number
): Promise<ImageType[]> => {
  const res = await axios.get("/api/data", { params: { page, limit } });
  return res.data;
};

// Delete image mutation function
const deleteImage: MutationFunction<void, number> = async (id: number) => {
  await axios.delete(`/api/delete/${id}`);
};

const GalleryClient: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1); // Manage the current page
  const [limit] = useState(8); // Set a limit for the number of images per page
  const [previousImages, setPreviousImages] = useState<ImageType[]>([]);

  const queryClient = useQueryClient();

  const { data: images = [], error, isLoading } = useQuery<ImageType[]>({
    queryKey: ["images", currentPage, limit], // Include pagination in the query key
    queryFn: () => fetchImages(currentPage, limit), // Pass page and limit to the fetch function
  });

  useEffect(() => {
    if (!isLoading && images.length > 0) {
      setPreviousImages(images);
    }
  }, [images, isLoading]);

  const mutation = useMutation({
    mutationFn: deleteImage,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: ["images", currentPage, limit],
      });

      const previousImages = queryClient.getQueryData<ImageType[]>([
        "images",
        currentPage,
        limit,
      ]);

      queryClient.setQueryData<ImageType[]>(
        ["images", currentPage, limit],
        (old) => old?.filter((image) => image.id !== id) || []
      );

      return { previousImages };
    },
    onError: (err, id, context) => {
      if (context?.previousImages) {
        queryClient.setQueryData(
          ["images", currentPage, limit],
          context.previousImages
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["images", currentPage, limit],
      });
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // Update the current page
  };

  // Show loading indicator and previous images while loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
        {previousImages.length > 0 && (
          <ImageGallery images={previousImages} handleDelete={handleDelete} />
        )}
      </div>
    );
  }

  // Show error message if there is an error
  if (error) {
    return (
      <div>
        Error loading images:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Show message if no images are available
  if (images.length === 0) {
    return <div>No images available.</div>;
  }

  return (
    <div>
      <ImageGallery images={images} handleDelete={handleDelete} />

      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        hasNextPage={images.length === limit}
      />
    </div>
  );
};

// Memoized ImageGallery component
const ImageGallery = memo(({ images, handleDelete }: ImageGalleryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative overflow-hidden rounded-lg shadow-lg"
        >
          <Link href={`/open/${image.id}`} className="block">
            <div className="relative h-[90%]">
              <Image
                className="w-full h-full object-cover"
                src={image.imgurl}
                alt={`Image ${image.id}`}
                width={1000}
                height={1000}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="absolute top-1 right-2 flex gap-x-3">
                    <FaHeart className="text-xl cursor-pointer text-black bg-gray-200 hover:bg-white transition-colors duration-300 border-white border-[1px] p-[6px] w-9 h-7 rounded-sm" />
                    <FaPlus className="text-xl cursor-pointer text-black bg-gray-200 hover:bg-white transition-colors duration-300 border-white border-[1px] p-[6px] w-9 h-7 rounded-sm" />
                  </div>
                  <FaDownload className="absolute bottom-9 right-2 text-xl cursor-pointer text-black bg-gray-200 hover:bg-white transition-colors duration-300 border-white border-[1px] p-[6px] w-9 h-7 rounded-sm" />
                </div>
              </div>
            </div>
          </Link>
          <div className="absolute bottom-0 w-full bg-gray-800 flex justify-between items-center p-2">
            <MdDelete
              onClick={() => handleDelete(image.id)}
              className="text-white text-xl cursor-pointer hover:text-red-500 transition-colors duration-300"
            />
            <Link href={`/update?id=${image.id}&imgurl=${encodeURIComponent(image.imgurl)}`}>
              <RxUpdate className="text-white text-xl cursor-pointer hover:text-blue-500 transition-colors duration-300" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery'; // Add this line


type ImageGalleryProps = {
  images: ImageType[];
  handleDelete: (id: number) => void;
};

// Pagination component
const Pagination: React.FC<{
  currentPage: number;
  onPageChange: (newPage: number) => void;
  hasNextPage: boolean;
}> = ({ currentPage, onPageChange, hasNextPage }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 flex items-center bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
      >
        <MdNavigateBefore className="mr-2 text-lg" />
        Previous
      </button>
      <span className="text-lg font-semibold text-gray-700">{`Page ${currentPage}`}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-4 py-2 flex items-center bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
      >
        Next
        <MdNavigateNext className="ml-2 text-lg" />
      </button>
    </div>
  );
};

Pagination.displayName = 'Pagination'; // Add this line


export default GalleryClient;
