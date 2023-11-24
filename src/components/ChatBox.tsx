"use client";

import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { Message } from "ai";
import MessagesProvider from "./contexts/MessagesProvider";

type Props = {
    chatFileKey: string;
    chatId: number;
    initialMessages: Message[];
    children: React.ReactNode;
};

const ChatBox = ({ chatFileKey, chatId, initialMessages, children }: Props) => {
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: "/api/chat",
        body: {
            chatFileKey: chatFileKey,
            chatId: chatId,
        },
        initialMessages: initialMessages,
    });

    useEffect(() => {
        const messageContainer = document.getElementById("message-container");
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div
            className="relative max-h-screen overflow-scroll"
            id="message-container"
        >
            {/* Header */}
            <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
                <h3 className="text-xl font-bold">Chat</h3>
            </div>

            {/* Message List */}
            <MessagesProvider messages={messages}>{children}</MessagesProvider>

            <form
                onSubmit={handleSubmit}
                className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
            >
                <div className="flex">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask any question..."
                        className="flex-8"
                    />
                    <Button className="flex-2 ml-2 bg-blue-600">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;
