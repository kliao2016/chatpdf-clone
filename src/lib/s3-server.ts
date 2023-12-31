import "server-only";
import AWS from 'aws-sdk';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import fs from "fs";

export async function getS3UploadPresignedUrl(fileName: string) {
    try {
        AWS.config.update({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.S3_BUCKET_NAME,
            },
            region: process.env.S3_REGION,
        });

        const fileKey: string = "uploads/" + Date.now().toString() + fileName.replace(" ", "-");

        const presignParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
            Expires: 10,
            ContentType: "application/pdf",
        };

        const presignedUploadUrl: string = await s3.getSignedUrlPromise("putObject", presignParams);

        return Promise.resolve({
            signedUploadUrl: presignedUploadUrl,
            fileKey: fileKey,
            fileName: fileName,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function downloadFromS3(fileKey: string): Promise<string | null> {
    try {
        const presignedDownloadUrl = await getSignedUrlPromise(fileKey);
        const config: AxiosRequestConfig = {
            responseType: "arraybuffer",
            onDownloadProgress: (event: AxiosProgressEvent) => {
                console.log("Downloading from s3...", parseInt(((event.loaded * 100) / (event.total ?? 1)).toString()) + "%");
            }
        };

        const responseBlob = await axios.get(presignedDownloadUrl, config);

        const fileName = `/tmp/pdf-${Date.now()}.pdf`;
        fs.writeFileSync(fileName, responseBlob.data as Buffer);
        return fileName;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function getS3Url(fileKey: string): string {
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileKey}`;
    return url;
}

export async function getSignedUrlPromise(fileKey: string): Promise<string> {
    AWS.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
        params: {
            Bucket: process.env.S3_BUCKET_NAME,
        },
        region: process.env.S3_REGION,
    });

    const presignParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Expires: 10,
    }

    return s3.getSignedUrlPromise("getObject", presignParams);
}