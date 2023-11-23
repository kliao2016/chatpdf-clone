import { NextResponse } from 'next/server';
import { getS3UploadPresignedUrl } from "@/lib/s3-server";

export async function GET(req: Request, res: Response) {
    try {
        const { searchParams } = new URL(req.url);
        const fileName: string | null = searchParams.get("fileName");
        if (!fileName) {
            return NextResponse.json({ error: "Invalid request body! Must have fileName key with string value!" }, { status: 400 });
        }

        const { signedUploadUrl, fileKey } = await getS3UploadPresignedUrl(fileName);
        return NextResponse.json(
            {
                signedUploadUrl: signedUploadUrl,
                fileKey: fileKey,
                fileName: fileName,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 },
        );
    }
}