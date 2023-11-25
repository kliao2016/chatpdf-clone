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

/**
 * Helper function to make promise error handling easier.
 * 
 * @param promise The promise to await.
 * @returns A tuple of the result or error.
 */
export async function asyncWrap<T>(promise: Promise<T>): Promise<[T | null, any | null]> {
    try {
        const result = await promise;
        return [result, null];
    } catch (error) {
        return [null, error];
    }
}

/**
 * Helper function to return all fulfilled and defined values from an array of promises of the same type.
 * 
 * @param promises The array of promises.
 * @returns A promise that resolves to an array of values.
 */
export async function fulfilledAndDefinedPromises<T>(promises: Promise<T>[]): Promise<T[]> {
    const results = await Promise.allSettled(promises);
    const fulfilled = results.filter((result) => {
        return result.status === "fulfilled";
    }) as PromiseFulfilledResult<T>[];
    const values = fulfilled.map((result) => {
        return result.value;
    });
    return Promise.resolve(values);
}