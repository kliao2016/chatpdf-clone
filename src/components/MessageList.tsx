"use client";

import { cn } from "@/lib/utils";
import { Message } from "ai";
import React from "react";

type Props = {
    messages: Message[];
    isLoading: boolean;
};

const MessageList = ({ messages, isLoading }: Props) => {
    if (!messages && !isLoading) return <></>;
    return (
        <div className="flex flex-col gap-2 px-4 mb-4">
            {messages.map((message) => {
                return (
                    <div
                        key={message.id}
                        className={cn("flex", {
                            "justify-end pl-10": message.role === "user",
                            "justify-start pr-10": message.role === "assistant",
                        })}
                    >
                        <div
                            className={cn(
                                "rounded-lg px-3 textsm py-1 shadow-md ring-1 ring-gray-900/10",
                                {
                                    "bg-blue-600 text-white":
                                        message.role === "user",
                                },
                            )}
                        >
                            <p>{message.content}</p>
                        </div>
                    </div>
                );
            })}

            {isLoading && (
                <div className="flex justify-start pr-10">
                    <div className="flex space-x-2 justify-center items-center rounded-lg px-3 textsm pt-3 pb-2 shadow-md ring-1 ring-gray-900/10">
                        <div className="bg-purple-400 w-2 h-2 rounded-full animate-bounce animation-delay-100" />
                        <div className="bg-purple-400 w-2 h-2 rounded-full animate-bounce animation-delay-200" />
                        <div className="bg-purple-400 w-2 h-2 rounded-full animate-bounce animation-delay-300" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageList;
