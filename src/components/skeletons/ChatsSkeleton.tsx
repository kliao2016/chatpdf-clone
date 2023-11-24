import React from "react";
import { Skeleton } from "../ui/skeleton";

const ChatsSkeleton = () => {
    const mockChats = [...new Array(10)];
    return (
        <div className="flex flex-col gap-2 mt-4">
            {mockChats.map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-64" />
                </div>
            ))}
        </div>
    );
};

export default ChatsSkeleton;
