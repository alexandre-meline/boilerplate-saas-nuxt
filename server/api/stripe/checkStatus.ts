import { PrismaClient } from '@prisma/client';
import { User } from '~/server/types';

const prisma = new PrismaClient();
const DAY_IN_MS = 86_400_000;

function isValidSubscription(stripePriceId: string | null, stripeCurrentPeriodEnd: Date | null): boolean {
  if (!stripePriceId || !stripeCurrentPeriodEnd) {
    return false;
  }
  const expiryTime = stripeCurrentPeriodEnd.getTime() + DAY_IN_MS;
  return expiryTime > Date.now();
}

async function getUserSubscription(userId: string) {
  try {
    const subscription = await prisma.userSubscription.findUnique({
      where: { userId },
      select: {
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
      },
    });
    return subscription;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw new Error('Database query failed');
  }
}

export default defineEventHandler(async (event) => {
  await protectedRoute(event);
  const user = event.context.user as User;

  let userSubscription;
  try {
    userSubscription = await getUserSubscription(user.id);
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }

  console.log('[USER_SUBSCRIPTION]', userSubscription);
  
  if (!userSubscription) {
    return { isSubscribed: false };
  }

  const { stripePriceId, stripeCurrentPeriodEnd } = userSubscription;
  const isValid = isValidSubscription(stripePriceId, stripeCurrentPeriodEnd);

  console.log('[IS_VALID]', isValid);
  return { isSubscribed: isValid };
});