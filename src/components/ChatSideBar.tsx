"use client";
import { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { MessageCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

type Props = {
    chats: DrizzleChat[];
    children: React.ReactNode;
};

const ChatSideBar = ({ chats, children }: Props) => {
    let activeChatId: string = "0";
    const params = useParams();
    if (params.chatId !== undefined && typeof params.chatId === "string") {
        activeChatId = params.chatId;
    }

    return (
        <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
            <Link href="/">
                <Button className="w-full border-dashed border-white border">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    New Chat
                </Button>
            </Link>

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

            <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                    <Link href="/">Home</Link>
                    <Link href="/">Source</Link>
                </div>

                {children}
            </div>
        </div>
    );
};

export default ChatSideBar;
