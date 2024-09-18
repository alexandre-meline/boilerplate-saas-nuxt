import { User } from "~/server/types"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }

  await protectedRoute(event);
  const user = event.context.user as User;

  const query = getQuery(event);
  const priceId = query.priceId as string;
  if (!priceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'priceId is required'
    });
  }
  console.log('Received priceId:', priceId);

  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId: user.id,
    },
  });

  const returnUrl = absoluteUrl('/pricing');
  const successUrl = absoluteUrl('/');
  let responseUrl = ''

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    });
    console.log('Stripe billing portal URL:', stripeSession.url);
    return {
      url: stripeSession.url,
    };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: returnUrl,
    payment_method_types: ['card'],
    mode: 'subscription',
    billing_address_collection: 'auto',
    customer_email: user.email,
    automatic_tax: {enabled: true},
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    metadata: {
      userId: user.id,
    }
  });
  responseUrl = stripeSession.url
  return {
    url: responseUrl
  };
});
