"use client"
import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <p className="text-white text-2xl font-bold">PicDrop</p>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/">
                <p className="text-white hover:bg-purple-700 hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Home</p>
              </Link>
              <Link href="/gallery">
                <p className="text-white hover:bg-purple-700 hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Gallery</p>
              </Link>
              <Link href="/upload">
                <p className="text-white hover:bg-purple-700 hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Upload</p>
              </Link>
              <Link href="/about">
                <p className="text-white hover:bg-purple-700 hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">About</p>
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-purple-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/">
            <p className="text-white hover:bg-purple-700 hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Home</p>
          </Link>
          <Link href="/gallery">
            <p className="text-white hover:bg-purple-700 hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Gallery</p>
          </Link>
          <Link href="/upload">
            <p className="text-white hover:bg-purple-700 hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Upload</p>
          </Link>
          <Link href="/about">
            <p className="text-white hover:bg-purple-700 hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">About</p>
          </Link>
          <Link href="/contact">
            <p className="text-white hover:bg-purple-700 hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Contact</p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
