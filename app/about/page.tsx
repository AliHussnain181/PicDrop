"use client"
import { useEffect } from 'react';
import Head from 'next/head';

export default function About() {
  useEffect(() => {
    const textContainer = document.getElementById('text-container');

    // Fade-in and slide-up animation for text container
    if (textContainer) {
      textContainer.classList.add('animate-fade-in-slide-up');
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn about our company and what we do." />
      </Head>
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">About Us</h1>
          <div id="text-container" className="mx-auto max-w-lg opacity-0 transform translate-y-8">
            <p className="text-lg text-gray-700 mt-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero at lectus condimentum,
              sit amet interdum tortor pellentesque. Sed vel lorem non tortor finibus consequat. Sed eu nisl fermentum,
              efficitur eros id, posuere metus. Proin commodo orci vitae arcu convallis, vel ultricies mi eleifend. Donec
              vel lobortis tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
              Nullam faucibus sapien purus, quis dictum purus feugiat nec. Cras venenatis orci non lacus lobortis, a
              scelerisque tortor blandit. Vivamus blandit orci vel dui malesuada, non consectetur elit sodales. Morbi nec
              ex at ipsum malesuada rhoncus at in nisi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
