import "server-only";
import { unstable_cache } from 'next/cache';
import { chats } from './db/schema';
import { eq } from 'drizzle-orm';
import { db } from './db';

const getAllChats = unstable_cache(
    async (userId: string) => {
        return db.select().from(chats).where(eq(chats.userId, userId));
    },
    ["all-chats"],
    {
        revalidate: 60, // 60 seconds
    },
);

export default getAllChats;