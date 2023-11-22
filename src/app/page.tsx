import { unstable_noStore as noStore } from "next/cache";
import FileUpload from "@/components/FileUpload";
import SubscriptionButton from "@/components/SubscriptionButton";
import { Button } from "@/components/ui/button";
import { checkSubscription } from "@/lib/subscription";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRight, LogInIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
    noStore();
    const { userId }: { userId: string | null } = await auth();
    const isAuth: boolean = !!userId;
    const isPro: boolean = await checkSubscription();

    return (
        <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-300 to-purple-400">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center">
                        <h1 className="mr-3 text-5xl font-semibold">
                            Chat with any PDF
                        </h1>
                        <UserButton afterSignOutUrl="/"></UserButton>
                    </div>

                    <div className="flex mt-2">
                        {isAuth && (
                            <Link href={`/chats/`}>
                                <Button>
                                    Go to Chats
                                    <ArrowRight className="ml-2 w-5 h-5"></ArrowRight>
                                </Button>
                            </Link>
                        )}
                        <div className="ml-3">
                            <SubscriptionButton isPro={isPro} />
                        </div>
                    </div>

                    <p className="max-w-xl mt-1 text-lg text-slate-600">
                        Join millions of students, researchers, and
                        professionals to instantly answer questions and
                        understand research with AI
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
    );
}
