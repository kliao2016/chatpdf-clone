import { db } from "@/lib/db";
import { ALL_CHATS_QUERY_KEY } from "@/lib/db-queries";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { fileKey, fileName } = body;
        console.log("Uploading to pinecone...");
        await loadS3IntoPinecone(fileKey);

        // Create new chat
        console.log("Creating chat...");
        const chatId = await db
            .insert(chats)
            .values({
                fileKey: fileKey,
                pdfName: fileName,
                userId: userId,
            })
            .returning(
                {
                    insertedId: chats.id,
                }
            );

        revalidateTag(ALL_CHATS_QUERY_KEY);
        revalidatePath("/chats/");
        return NextResponse.json(
            {
                chatId: chatId[0].insertedId,
                revalidated: true,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 },
        );
    }
}