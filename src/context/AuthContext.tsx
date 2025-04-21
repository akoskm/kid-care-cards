"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { saltManager } from '@/lib/salt-manager';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saltLoading, setSaltLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user?.id) {
          setSaltLoading(true);
          try {
            await saltManager.getUserSalt(session.user.id);
          } catch (error) {
            console.error('Failed to fetch salt:', error);
          } finally {
            if (mounted) {
              setSaltLoading(false);
              setLoading(false);
            }
          }
        } else {
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.id) {
        setSaltLoading(true);
        saltManager.getUserSalt(session.user.id)
          .catch(error => console.error('Failed to fetch salt:', error))
          .finally(() => {
            if (mounted) {
              setSaltLoading(false);
              setLoading(false);
            }
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setSaltLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.session?.user?.id) {
        await saltManager.getUserSalt(data.session.user.id);
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setSaltLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear the salt cache for the current user
    if (user?.id) {
      saltManager.clearUserSalt(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading: loading || saltLoading,  // Consider app loading while salt is loading
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
