"use client";

import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '../main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default function SettingsPage() {
  const { isSubscribed, isTrialing, trialEndsAt, subscriptionType, loading, dictationUsage } = useSubscription();
  const { session, loading: authLoading } = useAuth();

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
                    `You are currently on the ${subscriptionType} plan`
                  ) : isTrialing ? (
                    `Trial ends in ${formatDistanceToNow(trialEndsAt!)}`
                  ) : (
                    'Your trial has ended'
                  )
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {isTrialing && (
            <Card>
              <CardHeader>
                <CardTitle>Dictation Usage</CardTitle>
                <CardDescription>
                  You have used {dictationUsage} out of 3 dictations in your trial period
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