"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function SignOutButton() {

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to sign-in page after signing out
      window.location.href = '/sign-in';
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
