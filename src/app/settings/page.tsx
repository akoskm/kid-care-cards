"use client";

import { useSubscription } from '@/context/SubscriptionContext';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '../main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { isSubscribed, isTrialing, trialEndsAt, subscriptionType, loading, dictationUsage, dictationUsageLimit } = useSubscription();
  const { session, loading: authLoading } = useAuth();
  const [subscriptionEndsAt, setSubscriptionEndsAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!session || !isSubscribed) return;

      try {
        const response = await fetch('/api/stripe/subscription-status', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const { subscriptionEndsAt } = await response.json();
          setSubscriptionEndsAt(subscriptionEndsAt);
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchSubscriptionStatus();
  }, [session, isSubscribed]);

  const handleSubscribe = async (priceId: string) => {
    if (!session) {
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ priceId })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) return;
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-4">
        <div className="flex items-center px-4 mb-4">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="px-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                {loading ? 'Loading...' : (
                  isSubscribed ? (
                    subscriptionEndsAt ?
                    `Your ${subscriptionType} plan will end on ${new Date(subscriptionEndsAt).toLocaleDateString()}` :
                    `You are currently on the ${subscriptionType} plan`
                  ) : isTrialing ? (
                    `Trial ends in ${formatDistanceToNow(trialEndsAt!)}`
                  ) : (
                    'Your trial has ended'
                  )
                )}
              </CardDescription>
            </CardHeader>
            {isSubscribed && (
              <CardContent>
                <Button
                  className="w-full"
                  onClick={handleManageSubscription}
                >
                  Manage Subscription
                </Button>
              </CardContent>
            )}
          </Card>

          {isTrialing && (
            <Card>
              <CardHeader>
                <CardTitle>Dictation Usage</CardTitle>
                <CardDescription>
                  You have used {dictationUsage} out of {dictationUsageLimit} dictations in your trial period
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!isSubscribed && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly</CardTitle>
                  <CardDescription>$5 per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!)}
                  >
                    Subscribe Monthly
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Annual</CardTitle>
                  <CardDescription>$50 per year (save $10)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!)}
                  >
                    Subscribe Annually
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}