"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from './SignOutButton';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't render navigation if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Top navigation for sign-out */}
      <div className="fixed top-0 right-0 p-4 z-10">
        <SignOutButton />
      </div>

      {/* Bottom navigation for page links */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t py-2">
        <div className="container mx-auto flex justify-around">
          <Button
            asChild
            variant={pathname === '/symptoms' ? 'default' : 'ghost'}
            className="flex flex-col items-center h-auto py-2 px-4"
          >
            <Link href="/symptoms">
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-xs mt-1">Symptoms</span>
            </Link>
          </Button>

          <Button
            asChild
            variant={pathname === '/children' ? 'default' : 'ghost'}
            className="flex flex-col items-center h-auto py-2 px-4"
          >
            <Link href="/children">
              <Users className="h-6 w-6" />
              <span className="text-xs mt-1">Children</span>
            </Link>
          </Button>
        </div>
      </nav>
    </>
  );
}
