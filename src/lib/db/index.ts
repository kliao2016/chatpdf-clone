import "server-only";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
class DrizzleDBUtility {
    private static _instance: DrizzleDBUtility;
    private static _db: NeonHttpDatabase<Record<string, never>>;

    constructor() {
        if (DrizzleDBUtility._instance) {
            throw new Error("New db instance cannot be created!");
        }

        neonConfig.fetchConnectionCache = true;
        if (!process.env.DB_URL) {
            throw new Error("Database URL not found!");
        }
        const sql = neon(process.env.DB_URL);
        DrizzleDBUtility._db = drizzle(sql);
        DrizzleDBUtility._instance = this;
    }

    getDB(): NeonHttpDatabase<Record<string, never>> {
        return DrizzleDBUtility._db;
    }
}

const drizzleDBUtilityInstance = Object.freeze(new DrizzleDBUtility());
export const db: NeonHttpDatabase<Record<string, never>> = drizzleDBUtilityInstance.getDB();