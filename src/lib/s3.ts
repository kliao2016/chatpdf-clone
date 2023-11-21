import axios, { AxiosProgressEvent } from 'axios';
import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: process.env.NEXT_PUBLIC_S3_REGION,
        });

        const fileKey = "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

        const presignParams = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: fileKey,
            Expires: 10,
            ContentType: "application/pdf",
        };

        const presignedUploadUrl = await s3.getSignedUrlPromise("putObject", presignParams);

        const config = {
            headers: {
                'Content-Type': file.type
            },
            onUploadProgress: (event: AxiosProgressEvent) => {
                console.log("Uploading to s3...", parseInt(((event.loaded * 100) / (event.total ?? 1)).toString()) + "%");
            }
        };

        await axios
            .put(presignedUploadUrl, file, config)
            .then((_) => {
                console.log("Successfully uploaded to S3!", fileKey);
            });

        return Promise.resolve({
            fileKey,
            fileName: file.name,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function getS3Url(fileKey: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileKey}`;
    return url;
}