import { unstable_noStore as noStore } from "next/cache";
import ChatSideBar from "@/components/ChatSideBar";
import { db } from "@/lib/db";
import { chats, DrizzleChat } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ChatsProvider from "@/components/contexts/ChatContextProvider";

type Props = {
    children: React.ReactNode;
};

const ChatsLayout = async ({ children }: Props) => {
    noStore();
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return redirect("/sign-in");
    }
    const subscriptionPromise: Promise<boolean> = checkSubscription();

    const chatsPromise: Promise<DrizzleChat[]> = db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId));

    const [isPro, allChats] = await Promise.all([
        subscriptionPromise,
        chatsPromise,
    ]);

    if (!allChats) {
        return redirect("/");
    }

    return (
        <div className="flex max-h-screen overflow-scroll">
            <div className="flex w-full max-h-screen overflow-scroll">
                {/* Sidebar */}
                <div className="flex-[1] max-w-xs">
                    <ChatSideBar chats={allChats} isPro={isPro} />
                </div>

                <ChatsProvider allChats={allChats}>{children}</ChatsProvider>
            </div>
        </div>
    );
};

export default ChatsLayout;
