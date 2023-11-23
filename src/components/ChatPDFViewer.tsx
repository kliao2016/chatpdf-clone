// import { unstable_noStore as noStore } from "next/cache";
import { getSignedUrlPromise } from "@/lib/s3-server";
import React from "react";
import PDFViewer from "./ui/PDFViewer";

type Props = {
    fileKey: string;
};

const ChatPDFViewer = async ({ fileKey }: Props) => {
    // noStore();
    const presignedDownloadUrl = await getSignedUrlPromise(fileKey);
    return (
        <div className="h-full w-full">
            <PDFViewer presignedDownloadUrl={presignedDownloadUrl} />
        </div>
    );
};

export default ChatPDFViewer;
