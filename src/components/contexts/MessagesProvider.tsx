"use client";
import { Message } from "ai";
import React, { createContext, useState } from "react";

export const MessagesContext = createContext<Message[]>([]);

type Props = {
    children: React.ReactNode;
    messages: Message[];
};

const MessagesProvider = ({ messages, children }: Props) => {
    return (
        <MessagesContext.Provider value={messages}>
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesProvider;
