"use client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import React from "react";

type Props = {
    presignedDownloadUrl: string;
};

const PDFViewer = ({ presignedDownloadUrl }: Props) => {
    return (
        <Worker workerUrl={process.env.NEXT_PUBLIC_PDF_WORKER_URL!}>
            <Viewer fileUrl={presignedDownloadUrl} />
        </Worker>
    );
};

export default PDFViewer;
