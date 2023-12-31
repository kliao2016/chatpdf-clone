import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { Toaster } from "react-hot-toast";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ChatPDF Clone",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <React.StrictMode>
            <ClerkProvider>
                <Providers>
                    <html lang="en">
                        <body className={inter.className}>
                            {children}
                            <Toaster />
                        </body>
                    </html>
                </Providers>
            </ClerkProvider>
        </React.StrictMode>
    );
}
