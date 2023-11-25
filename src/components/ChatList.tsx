"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
    chats: DrizzleChat[];
};

const ChatList = ({ chats }: Props) => {
    let activeChatId: string = "0";
    const params = useParams();
    if (params.chatId !== undefined && typeof params.chatId === "string") {
        activeChatId = params.chatId;
    }

    return (
        <div className="f flex-col gap-2 mt-4">
            {chats.map((chat) => (
                <Link key={chat.id} href={`/chats/${chat.id}`}>
                    <div
                        className={cn(
                            "rounded-lg p-3 text-slate-300 flex items-center",
                            {
                                "bg-blue-600 text-white":
                                    chat.id.toString() === activeChatId,
                                "hover: text-white":
                                    chat.id.toString() !== activeChatId,
                            },
                        )}
                    >
                        <MessageCircle className="mr-2" />
                        <p>{chat.pdfName}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ChatList;
