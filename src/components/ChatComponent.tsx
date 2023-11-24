import { unstable_noStore as noStore } from "next/cache";
import { Message } from "ai";
import ChatBox from "./ChatBox";
import MessageList from "./MessageList";
import { db } from "@/lib/db";
import { DrizzleMessage, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Props = {
    chatFileKey: string;
    chatId: number;
};

const ChatComponent = async ({ chatFileKey, chatId }: Props) => {
    noStore();
    const dbMessages: DrizzleMessage[] = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId));
    const initialMessages: Message[] = dbMessages.map((message) => ({
        id: message.id.toString(),
        chatId: message.chatId.toString(),
        createdAt: message.createdAt,
        content: message.content,
        role: message.role,
    }));

    return (
        <ChatBox
            chatFileKey={chatFileKey}
            chatId={chatId}
            initialMessages={initialMessages ?? []}
        >
            <MessageList />
        </ChatBox>
    );
};

export default ChatComponent;
