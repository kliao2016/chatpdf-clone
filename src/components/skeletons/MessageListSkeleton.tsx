import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const MessageListSkeleton = () => {
    const mockMessages = [...new Array(10)];
    return (
        <div className="flex flex-col gap-2 px-4 mb-4">
            {mockMessages.map((_, index) => (
                <div
                    key={index}
                    className={cn("flex", {
                        "justify-end pl-10": index % 2 === 0,
                        "justify-start pr-10": index % 2 !== 0,
                    })}
                >
                    <Skeleton className="h-4 w-32" />
                </div>
            ))}
        </div>
    );
};

export default MessageListSkeleton;
