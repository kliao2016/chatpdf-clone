import "server-only";
import { db } from '@/lib/db';
import { auth } from "@clerk/nextjs";
import { eq } from 'drizzle-orm';
import { userSubscriptions } from './db/schema';

export const checkSubscription = async () => {
    const { userId } = await auth();
    if (!userId) {
        return false;
    }

    const subscriptions = await db
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.userId, userId));

    if (!subscriptions[0]) {
        return false;
    }

    const subscription = subscriptions[0];
    const isValid =
        subscription.stripePriceId != null &&
        (subscription.stripeCurrentPeriodEnd?.getTime() ?? Date.now()) > Date.now();

    return isValid;
}