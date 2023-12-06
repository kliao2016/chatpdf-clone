import "server-only";
import { Pinecone } from "@pinecone-database/pinecone";

class PineconeClientUtility {
    private static _instance: PineconeClientUtility;
    private static _pinecone: Pinecone;

    constructor() {
        if (PineconeClientUtility._instance) {
            throw new Error("New pinecone client instance cannot be created!");
        }

        if (!PineconeClientUtility._pinecone) {
            PineconeClientUtility._pinecone = new Pinecone({
                environment: process.env.PINECONE_ENVIRONMENT!,
                apiKey: process.env.PINECONE_API_KEY!
            });
        }

        PineconeClientUtility._instance = this;
    }

    getPineconeClient(): Pinecone {
        return PineconeClientUtility._pinecone;
    }
}

const pineconeClientUtilityInstance = Object.freeze(new PineconeClientUtility());
export const pineconeClient = pineconeClientUtilityInstance.getPineconeClient();