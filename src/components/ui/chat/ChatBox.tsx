"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../input";
import { useChat } from "ai/react";
import { Button } from "../button";
import { Send } from "lucide-react";
import { Message } from "ai";
import MessageList from "./MessageList";

type Props = {
    chatFileKey: string;
    chatId: number;
    initialMessages: Message[];
};

const ChatBox = ({ chatFileKey, chatId, initialMessages }: Props) => {
    const [waitingForStreamedResponse, setWaitingForStreamedResponse] =
        useState(false);
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: "/api/chat",
        body: {
            chatFileKey: chatFileKey,
            chatId: chatId,
        },
        initialMessages: initialMessages,
        onResponse: (_) => {
            setWaitingForStreamedResponse(false);
        },
        onError: (_) => {
            setWaitingForStreamedResponse(false);
        },
    });

    const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaitingForStreamedResponse(true);
        handleSubmit(e);
    };

    useEffect(() => {
        const messageContainer = document.getElementById("message-container");
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages.length]);

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
            <MessageList
                messages={messages}
                isLoading={waitingForStreamedResponse}
            />

            <form
                onSubmit={handleUserSubmit}
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
