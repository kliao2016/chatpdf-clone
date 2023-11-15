"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import ChatBox from "./ChatBox";

type Props = {
    chatFileKey: string;
    chatId: number;
};

const ChatComponent = ({ chatFileKey, chatId }: Props) => {
    // Note that we could use pure fetch and make this a server component
    const { data, isLoading } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const response = await axios.get<Message[]>("/api/get-messages", {
                params: {
                    chatId: chatId,
                },
            });
            return response.data;
        },
    });

    return (
        <ChatBox
            chatFileKey={chatFileKey}
            chatId={chatId}
            initialMessages={data ?? []}
            isLoading={isLoading}
        />
    );
};

export default ChatComponent;
