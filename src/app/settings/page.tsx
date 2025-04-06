"use client";

import { useAuth } from '@/context/AuthContext';
import MainLayout from '../main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { session, loading: authLoading } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!session) return;

      try {
        setLoading(true);
        const response = await fetch('/api/credits', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const { credits } = await response.json();
          setCredits(credits);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [session]);

  const handlePurchaseCredits = async (priceId: string) => {
    if (!session) {
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-credit-checkout', {
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
              <CardTitle>Your Credits</CardTitle>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <CardDescription>
                  You have {credits} credits remaining
                </CardDescription>
              )}
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>100 Credits</CardTitle>
                <CardDescription>$5</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => handlePurchaseCredits(process.env.NEXT_PUBLIC_STRIPE_SMALL_CREDITS_PRICE_ID!)}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>250 Credits</CardTitle>
                <CardDescription>$10</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => handlePurchaseCredits(process.env.NEXT_PUBLIC_STRIPE_MEDIUM_CREDITS_PRICE_ID!)}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>700 Credits</CardTitle>
                <CardDescription>$25</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => handlePurchaseCredits(process.env.NEXT_PUBLIC_STRIPE_LARGE_CREDITS_PRICE_ID!)}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}