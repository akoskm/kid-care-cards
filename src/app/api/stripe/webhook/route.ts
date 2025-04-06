import { headers } from 'next/headers';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
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
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const subscriptionId = subscription.id;
      const status = subscription.status;
      const priceId = subscription.items.data[0].price.id;
      const userId = subscription.metadata.userId;

      // Determine subscription type based on price ID
      const subscriptionType = priceId === process.env.STRIPE_MONTHLY_PRICE_ID ? 'monthly' : 'annual';

      console.log('Subscription:', subscription);

      // Update subscription in database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_type: subscriptionType,
          status: status === 'active' ? 'active' : 'past_due',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating subscription:', error);
        return new Response('Error updating subscription', { status: 500 });
      }

      console.log('Subscription updated successfully');
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId;

      // Update subscription status to canceled
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating subscription:', error);
        return new Response('Error updating subscription', { status: 500 });
      }

      console.log('Subscription updated successfully');
      break;
    }
  }

  return new Response('Webhook processed', { status: 200 });
}