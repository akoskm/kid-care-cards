import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface SubscriptionStatus {
  isSubscribed: boolean;
  isTrialing: boolean;
  trialEndsAt: Date | null;
  subscriptionType: 'monthly' | 'annual' | null;
  loading: boolean;
}

export function useSubscription(): SubscriptionStatus {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    isTrialing: false,
    trialEndsAt: null,
    subscriptionType: null,
    loading: true,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchSubscriptionStatus = async () => {
      try {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
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
          });
        } else {
          setStatus({
            isSubscribed: false,
            isTrialing: false,
            trialEndsAt: null,
            subscriptionType: null,
            loading: false,
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