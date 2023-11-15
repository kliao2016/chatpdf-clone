import { Pinecone, RecordValues } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

let pinecone: Pinecone | null = null;

export const getPineconeClient = () => {
    if (!pinecone) {
        pinecone = new Pinecone({
            environment: process.env.PINECONE_ENVIRONMENT!,
            apiKey: process.env.PINECONE_API_KEY!
        });
    }

    return pinecone;
};

export async function getMatchesFromEmbeddings(
    embeddings: RecordValues,
    fileKey: string
) {
    const client = await getPineconeClient();
    const pineconeIndex = client.Index(
        process.env.PINECONE_INDEX!
    );

    try {
        const filterKey = convertToAscii(fileKey);
        const queryResult = await pineconeIndex.query(
            {
                topK: 5,
                vector: embeddings,
                includeMetadata: true,
                filter: {
                    "filterIndex": { "$eq": filterKey },
                }
            }
        );

        return queryResult.matches || [];
    } catch (error) {
        console.log("Error querying embeddings", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

    const qualifyingRecords = matches.filter((match) => {
        return match.score && match.score > 0.7;
    });

    type Metadata = {
        text: string;
        pageNumber: number;
    }

    let docs = qualifyingRecords.map((record) => {
        const metadata = record.metadata as Metadata;
        return metadata.text;
    });
    return docs.join("\n").substring(0, 3000);
}