import "server-only";
import { RecordValues } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
    try {
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: [text.replace(/\n/g, " ")],
        });
        const result = await response.json();
        console.log(result);
        if (result.data && result.data[0] && result.data[0].embedding) {
            return result.data[0].embedding as RecordValues;
        } else {
            return [];
        }
    } catch (error) {
        console.log("Error calling OpenAI embeddings api", error);
        throw error;
    }
}