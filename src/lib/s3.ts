"use server";

import { uploadToS3 } from "./s3-server";

export async function uploadToS3Action(file: File): Promise<{
    fileKey: string;
    fileName: string;
}> {
    return uploadToS3(file);
}