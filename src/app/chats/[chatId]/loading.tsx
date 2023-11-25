import MessageListSkeleton from "@/components/skeletons/MessageListSkeleton";
import PDFSkeleton from "@/components/skeletons/PDFSkeleton";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Chats",
};

const ChatPageLoadingSkeleton = () => {
    return (
        <>
            {/* PDF Viewer Skeleton */}
            <div className="max-h-screen p-4 overflow-scroll flex-[5]">
                <PDFSkeleton />
            </div>

            {/* Chat Box Skeleton */}
            <div className="flex-[3] border-l-4 border-l-slate-200">
                <MessageListSkeleton />
            </div>
        </>
    );
};

export default ChatPageLoadingSkeleton;
