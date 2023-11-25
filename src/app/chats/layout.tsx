import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ChatsSkeleton from "@/components/skeletons/ChatsSkeleton";
import ChatListSuspenseWrapper from "@/components/ChatListSuspenseWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ButtonSkeleton from "@/components/skeletons/ButtonSkeleton";
import SubscriptionButtonSuspenseWrapper from "@/components/SubscriptionButtonSuspenseWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chats",
};

type Props = {
    children: React.ReactNode;
};

const ChatsLayout = async ({ children }: Props) => {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex max-h-screen overflow-scroll">
            <div className="flex w-full max-h-screen overflow-scroll">
                {/* Sidebar */}
                <div className="flex-[1] max-w-xs">
                    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
                        <Link href="/">
                            <Button className="w-full border-dashed border-white border">
                                <PlusCircle className="mr-2 w-4 h-4" />
                                New Chat
                            </Button>
                        </Link>

                        <Suspense fallback={<ChatsSkeleton />}>
                            <ChatListSuspenseWrapper userId={userId} />
                        </Suspense>

                        <div className="absolute bottom-4 left-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                                <Link href="/">Home</Link>
                                <Link href="/">Source</Link>
                            </div>

                            <Suspense fallback={<ButtonSkeleton />}>
                                <SubscriptionButtonSuspenseWrapper />
                            </Suspense>
                        </div>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
};

export default ChatsLayout;
