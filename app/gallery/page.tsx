// app/gallery/page.tsx
import Head from 'next/head';
import GalleryClient from './GalleryClient';

export default function GalleryPage() {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Image Gallery",
    "image": [
      {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1623434885/sample.jpg",
        "name": "Sample Image",
        "caption": "A sample image in the gallery"
      }
      // Add more images here if needed
    ]
  };

  return (
    <>
      <Head>
        <title>Image Gallery | Your Website</title>
        <meta name="description" content="Browse our image gallery featuring high-quality images." />
        <meta property="og:title" content="Image Gallery" />
        <meta property="og:description" content="Browse our image gallery featuring high-quality images." />
        <meta property="og:image" content="https://res.cloudinary.com/your-cloud-name/image/upload/v1623434885/sample.jpg" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <div className="bg-gray-100 min-h-screen">
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Image Gallery</h1>
            {/* Client-side dynamic gallery */}
            <GalleryClient />
          </div>
        </main>
      </div>
    </>
  );
}
