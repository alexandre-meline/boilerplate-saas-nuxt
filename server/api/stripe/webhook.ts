import { PrismaClient } from '@prisma/client'
import Stripe from "stripe"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const STRIPE_WEBHOOK_SECRET = config.stripeSecretWebhookKey;  

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook secret is not defined in runtime configuration');
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe webhook secret is missing',
    });
  }

  const signature = getHeader(event, 'stripe-signature') as string;
  const body = await readRawBody(event);

  // Verify the webhook signature
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Error verifying stripe webhook:', error);
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid signature',
    });
  }

  console.log('Valid Stripe event:', stripeEvent.type);

  const session = stripeEvent.data.object as Stripe.Checkout.Session;

  try {
    // Handle successful checkout session
    if (stripeEvent.type === 'checkout.session.completed') {
      console.log('Context:', event.context);
      console.log(`Handling checkout.session.completed event for session ${session.id}`);
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      console.log('Subscription:', subscription);

      if (!session?.metadata?.userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'User id is required',
        });
      }

      await prisma.userSubscription.create({
        data: {
          userId: session?.metadata?.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    // Handle customer subscription update
    if (stripeEvent.type === 'customer.subscription.updated') {
      console.log('Context:', event.context);
      console.log(`Handling customer.subscription.updated event for subscription ${stripeEvent.data.object.id} and user ${session?.metadata?.userId}`);
      const subscription = stripeEvent.data.object;
      await prisma.userSubscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
      });
    }


    // Handle customer subscription cancellation
    if (stripeEvent.type === 'customer.subscription.deleted') {
      console.log('Context:', event.context);
      console.log(`Handling customer.subscription.deleted event for subscription ${stripeEvent.data.object.id} and user ${session?.metadata?.userId}`);
      const subscription = stripeEvent.data.object;
      await prisma.userSubscription.delete({
          where: { stripeSubscriptionId: subscription.id },
      });
      // Ou changer le statut à "inactif"
      // await prisma.userSubscription.update({...})
   }

       // // Handle subscription update
    // if (stripeEvent.type === 'invoice.payment_succeeded') {
    //   console.log('Handling invoice.payment_succeeded event');
    //   const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    //   console.log('Subscription:', subscription);
    //   await prisma.userSubscription.update({
    //     where: {
    //       stripeSubscriptionId: subscription.id,
    //     },
    //     data: {
    //       stripePriceId: subscription.items.data[0].price.id,
    //       stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    //     },
    //   });

    //   // Si la subscription est mise à jour, on peut mettre à jour les données de l'utilisateur
    //   // "billing_reason": "subscription_update",

    // }

    return 200;
  } catch (error) {
    console.error('Error processing Stripe event:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
});