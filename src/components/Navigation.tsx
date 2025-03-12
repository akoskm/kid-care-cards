"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from './SignOutButton';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <>
      {/* Top navigation for sign-out */}
      <div className="fixed top-0 right-0 p-4 z-10">
        <SignOutButton />
      </div>
      
      {/* Bottom navigation for page links */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
        <div className="container mx-auto flex justify-around">
        <Link 
          href="/"
          className={`flex flex-col items-center px-4 py-2 ${pathname === '/' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs mt-1">Symptoms</span>
        </Link>
        
        <Link 
          href="/children"
          className={`flex flex-col items-center px-4 py-2 ${pathname === '/children' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-xs mt-1">Children</span>
        </Link>
      </div>
    </nav>
    </>
  );
}
