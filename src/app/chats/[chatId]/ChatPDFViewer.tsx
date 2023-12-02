import React from "react";
import PDFViewer from "../../../components/ui/PDFViewer";

type Props = {
    presignedDownloadUrl: string;
};

const ChatPDFViewer = async ({ presignedDownloadUrl }: Props) => {
    return (
        <div className="h-full w-full">
            <PDFViewer presignedDownloadUrl={presignedDownloadUrl} />
        </div>
    );
};

export default ChatPDFViewer;
