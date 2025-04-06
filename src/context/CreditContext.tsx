'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface CreditStatus {
  credits: number;
  loading: boolean;
  fetchCredits: () => Promise<void>;
}

const CreditContext = createContext<CreditStatus>({
  credits: 0,
  loading: true,
  fetchCredits: async () => {},
});

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchCredits = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: creditData, error } = await supabase
        .from('credits')
        .select('credits')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      setCredits(creditData?.credits || 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchCredits();
  }, [session?.user?.id, fetchCredits]);

  return (
    <CreditContext.Provider value={{ credits, loading, fetchCredits }}>
      {children}
    </CreditContext.Provider>
  );
}

export function useCredits() {
  return useContext(CreditContext);
}