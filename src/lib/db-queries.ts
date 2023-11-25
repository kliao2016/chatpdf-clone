import "server-only";
import { unstable_cache } from 'next/cache';
import { chats } from './db/schema';
import { eq } from 'drizzle-orm';
import { db } from './db';

export const ALL_CHATS_QUERY_KEY = "all-chats";

const getAllChats = unstable_cache(
    async (userId: string) => {
        return db.select().from(chats).where(eq(chats.userId, userId));
    },
    [ALL_CHATS_QUERY_KEY],
    {
        revalidate: 60, // 60 seconds
        tags: [ALL_CHATS_QUERY_KEY],
    },
);

export default getAllChats;