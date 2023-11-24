import "server-only";
import { Pinecone } from "@pinecone-database/pinecone";

let _instance: PineconeClientUtility;
let _pinecone: Pinecone;
class PineconeClientUtility {
    constructor() {
        if (_instance) {
            throw new Error("New pinecone client instance cannot be created!");
        }

        if (!_pinecone) {
            _pinecone = new Pinecone({
                environment: process.env.PINECONE_ENVIRONMENT!,
                apiKey: process.env.PINECONE_API_KEY!
            });
        }

        _instance = this;
    }

    getPineconeClient(): Pinecone {
        return _pinecone;
    }
}

const pineconeClientUtilityInstance = Object.freeze(new PineconeClientUtility());
export const pineconeClient = pineconeClientUtilityInstance.getPineconeClient();