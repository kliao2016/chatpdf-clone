import { unstable_noStore as noStore } from "next/cache";
import getAllChats from "@/lib/db-queries";
import { DrizzleChat } from "@/lib/db/schema";
import React from "react";
import ChatList from "./ChatList";

type Props = {
    userId: string;
};

const ChatListSuspenseWrapper = async ({ userId }: Props) => {
    noStore();
    const allChats: DrizzleChat[] = await getAllChats(userId);

    return <ChatList chats={allChats} />;
};

export default ChatListSuspenseWrapper;
