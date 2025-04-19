"use client";

import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/context/CreditContext';
import MainLayout from '../main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SettingsContent() {
  const { session, loading: authLoading } = useAuth();
  const { credits, loading, fetchCredits } = useCredits();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleExportData = async () => {
    if (!session) {
      return;
    }

    try {
      const response = await fetch('/api/export-data', {
        headers: {
          'x-user-id': session.user.id
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `kid-care-cards-${new Date().toISOString().split('T')[0]}.csv`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export Successful',
        description: 'Your data has been exported successfully.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      toast({
        title: 'Payment Successful',
        description: 'Your credits have been added to your account.',
        variant: 'default',
      });
      fetchCredits();
    }
  }, [searchParams, toast, fetchCredits]);

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
      router.push(url);
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
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
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <CardDescription>
                You have {credits} credits remaining
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Data</CardTitle>
            <CardDescription>
              Export all your symptoms and solutions data in CSV format. The export will include:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Symptom details (name, severity, age group)</li>
                <li>Associated solutions (description, effectiveness, time to relief)</li>
                <li>Child name (if applicable)</li>
              </ul>
            </CardDescription>
            <div className="mt-4">
              <Button
                onClick={handleExportData}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Export My Data
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 100 Credits */}
          <div className="bg-card rounded-lg p-8 shadow-lg">
            <div className="bg-accent/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
              100 CREDITS
            </div>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold">$5</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-muted-foreground">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                No-charge setup!
              </li>
              <li className="flex items-center text-muted-foreground">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Buy only what you need
              </li>
            </ul>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => handlePurchaseCredits(process.env.NEXT_PUBLIC_STRIPE_SMALL_CREDITS_PRICE_ID!)}
            >
              Purchase
            </Button>
          </div>

          {/* 250 Credits */}
          <div className="bg-card rounded-lg p-8 shadow-lg border-4 border-accent relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                BEST VALUE
              </span>
            </div>
            <div className="bg-accent/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
              250 CREDITS
            </div>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold">$10</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-muted-foreground">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save $2.50
              </li>
              <li className="flex items-center text-muted-foreground">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Best value
              </li>
            </ul>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => handlePurchaseCredits(process.env.NEXT_PUBLIC_STRIPE_MEDIUM_CREDITS_PRICE_ID!)}
            >
              Purchase
            </Button>
          </div>

          {/* 700 Credits */}
          <div className="bg-card rounded-lg p-8 shadow-lg">
            <div className="bg-accent/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
              700 CREDITS
            </div>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold">$25</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-muted-foreground">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save $10
              </li>
              <li className="flex items-center text-muted-foreground">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Perfect for frequent use
              </li>
            </ul>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => handlePurchaseCredits(process.env.NEXT_PUBLIC_STRIPE_LARGE_CREDITS_PRICE_ID!)}
            >
              Purchase
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </div>
      }>
        <SettingsContent />
      </Suspense>
    </MainLayout>
  );
}