import { unstable_noStore as noStore } from "next/cache";
import FileUpload from "@/components/ui/main/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRight, LogInIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import SubscriptionButtonSuspenseWrapper from "@/components/ui/main/SubscriptionButtonSuspenseWrapper";
import ButtonSkeleton from "@/components/ui/skeletons/ButtonSkeleton";

export default function Home() {
    noStore();
    const { userId }: { userId: string | null } = auth();
    const isAuth: boolean = !!userId;

    return (
        <div className="w-screen h-screen overflow-hidden bg-gradient-to-r from-indigo-300 to-purple-400">
            <div className="mx-auto w-full h-full pt-6 px-6 2xl:w-1/2 2xl:px-0">
                <div className="w-full flex justify-end">
                    <UserButton afterSignOutUrl="/"></UserButton>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center">
                            <h1 className="text-5xl font-bold">
                                Chat with any PDF
                            </h1>
                        </div>

                        <div className="flex mt-2">
                            {isAuth ? (
                                <Link href={`/chats/`}>
                                    <Button>
                                        Go to Chats
                                        <ArrowRight className="ml-2 w-5 h-5"></ArrowRight>
                                    </Button>
                                </Link>
                            ) : null}
                            <div className="ml-3">
                                <Suspense fallback={<ButtonSkeleton />}>
                                    <SubscriptionButtonSuspenseWrapper />
                                </Suspense>
                            </div>
                        </div>

                        <p className="max-w-xl mt-1 text-lg text-slate-600">
                            Instantly answer questions and understand research
                            with AI
                        </p>

                        <div className="w-full mt-4">
                            {isAuth ? (
                                <FileUpload />
                            ) : (
                                <Link href={"/sign-in"}>
                                    <Button>
                                        Login to get Started!
                                        <LogInIcon className="2-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
