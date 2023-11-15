import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;
if (!process.env.DB_URL) {
    throw new Error("Database URL not found!");
}

const sql = neon(process.env.DB_URL);

export const db = drizzle(sql);