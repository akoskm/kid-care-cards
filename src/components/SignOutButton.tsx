"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function SignOutButton() {

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redirect to sign-in page after signing out
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSignOut}
      aria-label="Sign out"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
