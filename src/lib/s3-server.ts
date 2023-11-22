import "server-only";
import AWS from 'aws-sdk';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import fs from "fs";

export async function downloadFromS3(fileKey: string) {
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

        const presignParams = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: fileKey,
            Expires: 10,
        }

        const presignedDownloadUrl = await s3.getSignedUrlPromise("getObject", presignParams);

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