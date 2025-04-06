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
      const priceId = session.line_items?.data[0]?.price?.id;

      if (!userId || !priceId) {
        console.error('Missing userId or priceId in session');
        return new Response('Missing required data', { status: 400 });
      }

      // Get the number of credits from the price metadata
      const price = await stripe.prices.retrieve(priceId);
      const creditsToAdd = price.metadata.credits ? parseInt(price.metadata.credits) : 0;

      if (creditsToAdd <= 0) {
        console.error('Invalid credits amount');
        return new Response('Invalid credits amount', { status: 400 });
      }

      // Update user's credits
      const { error } = await supabaseAdmin
        .from('credits')
        .update({ credits: supabaseAdmin.rpc('increment_credits', { user_id: userId, amount: creditsToAdd }) })
        .eq('user_id', userId);

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