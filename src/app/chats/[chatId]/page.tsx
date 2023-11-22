"use client";
import ChatComponent from "@/components/ChatComponent";
import { ChatsContext } from "@/components/contexts/ChatContextProvider";
import PDFViewer from "@/components/PDFViewer";
import { DrizzleChat } from "@/lib/db/schema";
import React, { useContext } from "react";

type Props = {
    params: {
        chatId: string;
    };
};

const ChatPage = ({ params: { chatId } }: Props) => {
    const intChatId = parseInt(chatId);
    const allChats: DrizzleChat[] = useContext<DrizzleChat[]>(ChatsContext);
    const currentChat = allChats.find((chat) => chat.id === intChatId);

    return (
        <>
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
        </>
    );
};

export default ChatPage;
