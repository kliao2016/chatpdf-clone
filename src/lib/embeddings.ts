import "server-only";
import { RecordValues } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi } from "openai-edge";
import { z } from "zod";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

const recordValuesSchema = z.array(z.number());

export async function getEmbeddings(text: string) {
    try {
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: [text.replace(/\n/g, " ")],
        });
        const result = await response.json();
        if (result?.data &&
            result.data.length > 0 &&
            result.data[0]?.embedding &&
            recordValuesSchema.safeParse(result.data[0].embedding).success
        ) {
            return result.data[0].embedding as RecordValues;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error calling OpenAI embeddings api", error);
        throw error;
    }
}