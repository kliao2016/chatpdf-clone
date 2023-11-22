"use client";
import { DrizzleChat } from "@/lib/db/schema";
import React, { Context, createContext } from "react";

export const ChatsContext: Context<DrizzleChat[]> = createContext<
    DrizzleChat[]
>([]);

type Props = {
    children: React.ReactNode;
    allChats: DrizzleChat[];
};

const ChatsProvider = ({ children, allChats }: Props) => {
    return (
        <ChatsContext.Provider value={allChats}>
            {children}
        </ChatsContext.Provider>
    );
};

export default ChatsProvider;
