import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side Supabase client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function GET() {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');

    // Verify the session token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get subscription ID from subscriptions table
    const { data: subscriptionData } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (!subscriptionData?.stripe_subscription_id) {
      return new Response('No subscription found', { status: 404 });
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionData.stripe_subscription_id);
    const subscriptionEndsAt = subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null;

    return new Response(JSON.stringify({ subscriptionEndsAt }));
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return new Response('Error fetching subscription status', { status: 500 });
  }
}