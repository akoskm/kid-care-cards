"use client";

import { useEffect } from 'react';

export default function RedirectTest() {
  useEffect(() => {
    // Redirect immediately on page load
    window.location.href = '/';
  }, []);
  
  return (
    <div className="p-8">
      <p>Redirecting to home page...</p>
    </div>
  );
}
