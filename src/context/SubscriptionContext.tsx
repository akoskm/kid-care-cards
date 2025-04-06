'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface SubscriptionStatus {
  isSubscribed: boolean;
  isTrialing: boolean;
  trialEndsAt: Date | null;
  subscriptionType: 'monthly' | 'annual' | null;
  loading: boolean;
  dictationUsage: number;
  dictationUsageLimit: number;
  incrementDictationUsage: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionStatus>({
  isSubscribed: false,
  isTrialing: false,
  trialEndsAt: null,
  subscriptionType: null,
  loading: true,
  dictationUsage: 0,
  dictationUsageLimit: 10,
  incrementDictationUsage: async () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    isTrialing: false,
    trialEndsAt: null,
    subscriptionType: null,
    loading: true,
    dictationUsage: 0,
    dictationUsageLimit: 10,
    incrementDictationUsage: async () => {},
  });

  const { user } = useAuth();

  const incrementDictationUsage = async () => {
    if (!user || status.isSubscribed) return;

    try {
      const { error } = await supabase
        .from('dictation_usage')
        .update({ usage_count: status.dictationUsage + 1 })
        .eq('user_id', user.id);

      if (error) throw error;

      setStatus(prev => ({
        ...prev,
        dictationUsage: prev.dictationUsage + 1
      }));
    } catch (error) {
      console.error('Error updating dictation usage:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchSubscriptionStatus = async () => {
      try {
        // Fetch subscription status
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch dictation usage
        const { data: usage } = await supabase
          .from('dictation_usage')
          .select('usage_count, usage_limit')
          .eq('user_id', user.id)
          .single();

        if (subscription) {
          const trialEnd = subscription.trial_end_date ? new Date(subscription.trial_end_date) : null;
          const now = new Date();

          setStatus({
            isSubscribed: subscription.status === 'active',
            isTrialing: trialEnd ? trialEnd > now : false,
            trialEndsAt: trialEnd,
            subscriptionType: subscription.subscription_type || null,
            loading: false,
            dictationUsage: usage?.usage_count || 0,
            dictationUsageLimit: usage?.usage_limit || 10,
            incrementDictationUsage,
          });
        } else {
          setStatus({
            isSubscribed: false,
            isTrialing: false,
            trialEndsAt: null,
            subscriptionType: null,
            loading: false,
            dictationUsage: usage?.usage_count || 0,
            dictationUsageLimit: usage?.usage_limit || 10,
            incrementDictationUsage,
          });
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchSubscriptionStatus();
  }, [user?.id]);

  return (
    <SubscriptionContext.Provider value={status}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}