import "server-only";
import { RecordMetadata, RecordValues, ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
import { pineconeClient } from "./pinecone-client";

export async function getMatchesFromEmbeddings(
    embeddings: RecordValues,
    fileKey: string
): Promise<ScoredPineconeRecord<RecordMetadata>[]> {
    const pineconeIndex = pineconeClient.Index(
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

        return Promise.resolve(queryResult.matches || []);
    } catch (error) {
        console.log("Error querying embeddings", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query).catch((error) => {
        throw error;
    });

    const matches = await getMatchesFromEmbeddings(
        queryEmbeddings,
        fileKey
    ).catch((error) => {
        throw error;
    });

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