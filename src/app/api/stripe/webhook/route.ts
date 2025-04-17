import {Database} from '@/types/supabase';
import {createClient} from '@supabase/supabase-js';
import { headers } from 'next/headers';
import Stripe from 'stripe';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // Server-side Supabase client that bypasses RLS
  const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  console.log('Stripe webhook received!');

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 400 });
  }

  console.log('Event:', event.type);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.error('Missing userId in session');
        return new Response('Missing userId', { status: 400 });
      }

      // Retrieve the session with expanded line_items
      const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      const priceId = expandedSession.line_items?.data[0]?.price?.id;

      if (!priceId) {
        console.error('Missing priceId in session');
        return new Response('Missing priceId', { status: 400 });
      }

      // Get the number of credits from the price metadata
      const price = await stripe.prices.retrieve(priceId);
      const creditsToAdd = price.metadata.credits ? parseInt(price.metadata.credits) : 0;

      if (creditsToAdd <= 0) {
        console.error('Invalid credits amount');
        return new Response('Invalid credits amount', { status: 400 });
      }

      // Update user's credits using RPC function
      const { error } = await supabaseAdmin
        .rpc('increment_credits', {
          p_user_id: userId,
          p_amount: creditsToAdd
        });

      if (error) {
        console.error('Error updating credits:', error);
        return new Response('Error updating credits', { status: 500 });
      }

      console.log('Credits updated successfully');
      break;
    }
  }

  return new Response('Webhook processed', { status: 200 });
}