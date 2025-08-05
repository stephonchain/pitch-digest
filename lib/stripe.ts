import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export const DIGEST_PACK_PRICE_ID = process.env.STRIPE_PRICE_PACK_30;

if (!DIGEST_PACK_PRICE_ID) {
  throw new Error('Missing STRIPE_PRICE_PACK_30 environment variable');
}