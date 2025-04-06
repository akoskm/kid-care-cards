'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface CreditStatus {
  credits: number;
  loading: boolean;
}

const CreditContext = createContext<CreditStatus>({
  credits: 0,
  loading: true,
});

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<CreditStatus>({
    credits: 0,
    loading: true,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchCredits = async () => {
      try {
        setStatus(prev => ({ ...prev, loading: true }));

        const { data: creditData } = await supabase
          .from('credits')
          .select('credits')
          .eq('user_id', user.id)
          .single();

        setStatus({
          credits: creditData?.credits || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching credits:', error);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchCredits();
  }, [user?.id]);

  return (
    <CreditContext.Provider value={status}>
      {children}
    </CreditContext.Provider>
  );
}

export function useCredits() {
  return useContext(CreditContext);
}