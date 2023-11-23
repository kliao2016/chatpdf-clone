import ChatComponent from "@/components/ChatComponent";
import ChatPDFViewer from "@/components/ChatPDFViewer";
import getAllChats from "@/lib/db-queries";
import { DrizzleChat } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

type Props = {
    params: {
        chatId: string;
    };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return redirect("/sign-in");
    }

    const intChatId = parseInt(chatId);
    const allChats: DrizzleChat[] = await getAllChats(userId);
    const currentChat = allChats.find((chat) => chat.id === intChatId);

    return (
        <>
            {/* PDF Viewer */}
            <div className="max-h-screen p-4 overflow-scroll flex-[5]">
                <Suspense fallback={<div>Loading...</div>}>
                    <ChatPDFViewer fileKey={currentChat?.fileKey ?? ""} />
                </Suspense>
            </div>

            {/* Chat Box */}
            <div className="flex-[3] border-l-4 border-l-slate-200">
                <ChatComponent
                    chatFileKey={currentChat?.fileKey ?? ""}
                    chatId={intChatId}
                />
            </div>
        </>
    );
};

export default ChatPage;
