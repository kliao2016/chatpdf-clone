import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function convertToAscii(input: string) {
    // Remove non-ascii characters
    const asciiString = input.replace(/[^\x00-\x7F]/g, "");
    return asciiString;
}