import { stripe } from '@/lib/stripe';
import { userSubscriptions } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { auth, currentUser } from "@clerk/nextjs";
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

const return_url = `${process.env.NEXT_BASE_URL}/`;

export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const subscription = await db
            .select()
            .from(userSubscriptions)
            .where(eq(userSubscriptions.userId, userId));

        if (subscription[0] && subscription[0].stripeCustomerId) {
            // User is trying to cancel subscription
            const stripeBillingSession = await stripe.billingPortal.sessions.create({
                customer: subscription[0].stripeCustomerId,
                return_url: return_url,
            });

            return NextResponse.json({ url: stripeBillingSession.url });
        } else {
            // User's first time subscribing
            // TODO: Add idempotency if needed
            const stripeCheckoutSession = await stripe.checkout.sessions.create({
                success_url: return_url,
                cancel_url: return_url,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user?.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "ChatPDF Pro",
                                description: "Unlimited PDF sessions!",
                            },
                            unit_amount: 2000,
                            recurring: {
                                interval: "month",
                            },
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId,
                },
            });

            return NextResponse.json({ url: stripeCheckoutSession.url });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}