import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface SubscriptionStatus {
  isSubscribed: boolean;
  isTrialing: boolean;
  trialEndsAt: Date | null;
  subscriptionType: 'monthly' | 'annual' | null;
  loading: boolean;
  dictationUsage: number;
  dictationUsageLimit: number;
}

export function useSubscription(): SubscriptionStatus {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    isTrialing: false,
    trialEndsAt: null,
    subscriptionType: null,
    loading: true,
    dictationUsage: 0,
    dictationUsageLimit: 10,
  });

  const { user } = useAuth();

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
          });
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchSubscriptionStatus();

    // Subscribe to changes in the subscriptions table
    const subscription = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        fetchSubscriptionStatus
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return status;
}