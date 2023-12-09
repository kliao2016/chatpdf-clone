import React from "react";

const PDFSkeleton = () => {
    return (
        <div role="loading" className="space-y-2.5 animate-pulse max-w-lg">
            <div className="flex items-center w-full">
                <div className="flex-[6] h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <div className="flex-[4] h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600"></div>
                <div className="flex-[14] h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600"></div>
            </div>
            <div className="flex items-center w-full max-w-[480px]">
                <div className="flex-[5] h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                <div className="flex-[5] h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                <div className="flex-[2] h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
            </div>
            <div className="flex items-center w-full max-w-[400px]">
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            </div>
            <div className="flex items-center w-full max-w-[480px]">
                <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
            </div>
            <div className="flex items-center w-full max-w-[440px]">
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            </div>
            <div className="flex items-center w-full max-w-[360px]">
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                <div className="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default PDFSkeleton;
