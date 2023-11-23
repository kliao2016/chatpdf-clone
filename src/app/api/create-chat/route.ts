import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3-server";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
    const { userId } = await auth();
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
                pdfUrl: getS3Url(fileKey),
                userId: userId,
            })
            .returning(
                {
                    insertedId: chats.id,
                }
            );

        return NextResponse.json(
            {
                chatId: chatId[0].insertedId,
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