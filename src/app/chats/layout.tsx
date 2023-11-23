import { unstable_noStore as noStore } from "next/cache";
import ChatSideBar from "@/components/ChatSideBar";
import { DrizzleChat } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import getAllChats from "@/lib/db-queries";
import { Suspense } from "react";
import ButtonSkeleton from "@/components/skeletons/ButtonSkeleton";
import SubscriptionButtonSuspenseWrapper from "@/components/SubscriptionButtonSuspenseWrapper";

type Props = {
    children: React.ReactNode;
};

const ChatsLayout = async ({ children }: Props) => {
    noStore();
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return redirect("/sign-in");
    }

    const allChats: DrizzleChat[] = await getAllChats(userId);

    return (
        <div className="flex max-h-screen overflow-scroll">
            <div className="flex w-full max-h-screen overflow-scroll">
                {/* Sidebar */}
                <div className="flex-[1] max-w-xs">
                    <ChatSideBar chats={allChats}>
                        <Suspense fallback={<ButtonSkeleton />}>
                            <SubscriptionButtonSuspenseWrapper />
                        </Suspense>
                    </ChatSideBar>
                </div>

                {children}
            </div>
        </div>
    );
};

export default ChatsLayout;
