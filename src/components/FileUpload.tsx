"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";

function FileUpload() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: async ({
            fileKey,
            fileName,
        }: {
            fileKey: string;
            fileName: string;
        }) => {
            const response = await axios.post("/api/create-chat", {
                fileKey,
                fileName,
            });
            return response.data;
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "applicaton/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                // Larger than 10mb
                toast(
                    "Please upload a smaller file! Files larger than 10MB are not supported!",
                );
                return;
            }

            try {
                setUploading(true);
                const data = await uploadToS3(file);
                if (!data?.fileKey || !data?.fileName) {
                    toast("Error uploading vector embeddings to pinecone");
                    return;
                }
                mutate(data, {
                    onSuccess: ({ chatId }) => {
                        toast.success("Chat Created!");
                        router.push(`/chat/${chatId}`);
                    },
                    onError: (error) => {
                        toast.error("Error creating chat");
                    },
                });
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        },
    });

    return (
        <div className="p-2 bg-white rounded-xl">
            <div
                {...getRootProps({
                    className:
                        "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
                })}
            >
                <input {...getInputProps()} />
                {uploading || isPending ? (
                    <>
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                            Spilling Tea to GPT
                        </p>
                    </>
                ) : (
                    <>
                        <Inbox className="w-10 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400">
                            Drop PDF Here
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default FileUpload;
