import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "./SubscriptionButton";
import React from "react";

const SubscriptionButtonSuspenseWrapper = async () => {
    const isPro: boolean = await checkSubscription();

    return <SubscriptionButton isPro={isPro} />;
};

export default SubscriptionButtonSuspenseWrapper;
