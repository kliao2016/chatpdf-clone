import MessageListSkeleton from "@/components/ui/skeletons/MessageListSkeleton";
import PDFSkeleton from "@/components/ui/skeletons/PDFSkeleton";
import React from "react";

const ChatPageLoadingSkeleton = () => {
    return (
        <>
            {/* PDF Viewer Skeleton */}
            <div className="flex-[5] max-h-screen p-4 overflow-scroll">
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
