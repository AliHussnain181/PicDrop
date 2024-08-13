import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen ">
      <main>
        <section className="relative bg-gradient-to-r from-purple-500 to-indigo-500 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 pt-16 pb-20 md:pt-32 md:pb-36 lg:max-w-2xl lg:w-full lg:pb-56">
              <svg
                className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-indigo-500 transform translate-x-1/2"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>
              <div className="relative z-10">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block xl:inline">Welcome to</span>
                  <span className="block text-yellow-300 xl:inline">{" "}PicDrop</span>
                </h1>
                <p className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mt-10 lg:text-2xl lg:mx-0">
                  Upload and share your favorite images with the world. Explore a wide variety of images uploaded by others.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/upload">
                      <p className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10">
                        Upload Your Image
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://media.istockphoto.com/id/2149530993/photo/digital-human-head-concept-for-ai-metaverse-and-facial-recognition-technology.webp?b=1&s=170667a&w=0&k=20&c=lULwqJMRIROARRAlmkWZHm_tPs7z4uK1Ri6X6k5QisI="
              alt="Gallery"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
