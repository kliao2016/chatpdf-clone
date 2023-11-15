import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats, DrizzleChat } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
    params: {
        chatId: string;
    };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/sign-in");
    }

    const isPro: boolean = await checkSubscription();

    const allChats: DrizzleChat[] = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId));
    if (!allChats) {
        return redirect("/");
    }

    const intChatId: number = parseInt(chatId);

    if (!allChats.find((chat) => chat.id === intChatId)) {
        return redirect("/");
    }

    const currentChat = allChats.find((chat) => chat.id === intChatId);

    return (
        <div className="flex max-h-screen overflow-scroll">
            <div className="flex w-full max-h-screen overflow-scroll">
                {/* Sidebar */}
                <div className="flex-[1] max-w-xs">
                    <ChatSideBar
                        chats={allChats}
                        activeChatId={intChatId}
                        isPro={isPro}
                    />
                </div>

                {/* PDF Viewer */}
                <div className="max-h-screen p-4 overflow-scroll flex-[5]">
                    <PDFViewer pdfUrl={currentChat?.pdfUrl ?? ""} />
                </div>

                {/* Chat Box */}
                <div className="flex-[3] border-l-4 border-l-slate-200">
                    <ChatComponent
                        chatFileKey={currentChat?.fileKey ?? ""}
                        chatId={intChatId}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
