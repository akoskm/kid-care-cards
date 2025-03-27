import React from 'react';
import Navigation from '@/components/Navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
      </main>
      <Navigation />
    </div>
  );
}
