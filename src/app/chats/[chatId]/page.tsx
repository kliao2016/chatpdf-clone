import ChatBox from "@/components/ui/chat/ChatBox";
import PDFViewer from "@/components/ui/chat/PDFViewer";
import { db } from "@/lib/db";
import getAllChats from "@/lib/db-queries";
import { DrizzleChat, DrizzleMessage, messages } from "@/lib/db/schema";
import { getSignedUrlPromise } from "@/lib/s3-server";
import { auth } from "@clerk/nextjs";
import { Message } from "ai";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
    title: "Chats",
};

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
    const presignedDownloadUrlPromise: Promise<string> = getSignedUrlPromise(
        currentChat?.fileKey ?? "",
    );
    const dbMessagesPromise: Promise<DrizzleMessage[]> = db
        .select()
        .from(messages)
        .where(eq(messages.chatId, intChatId));

    // TODO: Better error handling to make sure a reject doesn't fail the other call
    const [presignedDownloadUrl, dbMessages] = await Promise.all([
        presignedDownloadUrlPromise,
        dbMessagesPromise,
    ]);

    const initialMessages: Message[] = dbMessages.map((message) => ({
        id: message.id.toString(),
        chatId: message.chatId.toString(),
        createdAt: message.createdAt,
        content: message.content,
        role: message.role,
    }));

    return (
        // TODO: Could stream in both components
        <>
            {/* PDF Viewer */}
            <div className="flex-[5] max-h-screen p-4 overflow-scroll">
                <div className="h-full w-full">
                    <PDFViewer presignedDownloadUrl={presignedDownloadUrl} />
                </div>
            </div>
            {/* Chat Box */}
            <div className="flex-[3] border-l-4 border-l-slate-200">
                <ChatBox
                    chatFileKey={currentChat?.fileKey ?? ""}
                    chatId={intChatId}
                    initialMessages={initialMessages ?? []}
                />
            </div>
        </>
    );
};

export default ChatPage;
