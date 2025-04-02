"use client";

import { useAuth } from '@/context/AuthContext';
import { TrialBanner } from '@/components/TrialBanner';
import Navigation from '@/components/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TrialBanner />
      <main>{children}</main>
      <Navigation />
    </div>
  );
}
