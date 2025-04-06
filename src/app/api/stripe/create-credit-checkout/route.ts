import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');

    // Verify the session token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { priceId } = await req.json();

    // Create or retrieve Stripe customer
    let customerId: string;
    try {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id
          }
        });
        customerId = customer.id;
      }
    } catch (error) {
      console.error('Error creating/retrieving customer:', error);
      return new Response('Error creating customer', { status: 500 });
    }

    // Create checkout session for one-time purchase
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
      metadata: {
        userId: user.id
      }
    });

    return new Response(JSON.stringify({ url: checkoutSession.url }));
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response('Error creating checkout session', { status: 500 });
  }
}