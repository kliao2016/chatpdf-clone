import { unstable_noStore as noStore } from "next/cache";
import { getSignedUrlPromise } from "@/lib/s3-server";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import React from "react";

type Props = {
    fileKey: string;
};

const PDFViewer = async ({ fileKey }: Props) => {
    noStore();
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const presignedDownloadUrl = await getSignedUrlPromise(fileKey);
    return (
        <div className="h-full w-full">
            <Worker workerUrl={process.env.NEXT_PUBLIC_PDF_WORKER_URL!}>
                <Viewer
                    fileUrl={presignedDownloadUrl}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
