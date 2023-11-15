import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const chatIdParam = searchParams.get("chatId");

    try {
        const chatId = chatIdParam ? parseInt(chatIdParam) : null;
        if (chatId) {
            const allMessages = await db.select().from(messages).where(eq(messages.chatId, chatId));
            return NextResponse.json(allMessages, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
        );
    }
}