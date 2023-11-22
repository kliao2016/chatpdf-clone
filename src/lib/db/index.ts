import "server-only";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

let _instance: DrizzleDBUtility;
let _db: NeonHttpDatabase<Record<string, never>>;
class DrizzleDBUtility {
    constructor() {
        if (_instance) {
            throw new Error("New db instance cannot be created!");
        }

        neonConfig.fetchConnectionCache = true;
        if (!process.env.DB_URL) {
            throw new Error("Database URL not found!");
        }
        const sql = neon(process.env.DB_URL);
        _db = drizzle(sql);
        _instance = this;
    }

    getDB(): NeonHttpDatabase<Record<string, never>> {
        return _db;
    }
}

const drizzleDBUtilityInstance = Object.freeze(new DrizzleDBUtility());
export const db: NeonHttpDatabase<Record<string, never>> = drizzleDBUtilityInstance.getDB();