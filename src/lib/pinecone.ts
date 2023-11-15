import { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { Pinecone, PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getEmbeddings } from './embeddings';
import md5 from "md5";
import { convertToAscii } from './utils';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';

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

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: { pageNumber: number }
    }
}

/**
 * Downloads a file from S3 and splits and vectorizes it before uploading to PineconeDB. This function essentially performs Retrieval Augmented Generation.
 * 
 * @param fileKey The file key for the file stored in S3.
 */
export async function loadS3IntoPinecone(fileKey: string) {
    // 1. obtain the pdf from s3 and read from it
    const fileName = await downloadFromS3(fileKey);
    if (fileName) {
        console.log(`Loaded ${fileName} from S3`);
        const loader = new PDFLoader(fileName);
        const pages = (await loader.load()) as PDFPage[];

        // 2. Split and segment pdf into smaller parts for better vectorization
        const documents = await Promise.all(
            pages.map(prepareDocument)
        );

        // 3. Vectorize and embed invidual documents
        const vectors: PineconeRecord<RecordMetadata>[] = await Promise.all(
            documents
                .flat()
                .map(async (doc: Document) => {
                    return embedDocument(doc, fileKey);
                })
        );

        // 4. Upload vectors to pinecone
        const client = await getPineconeClient();
        const pineconeIndex = client.Index(
            process.env.PINECONE_INDEX!
        );
        // We can ideally use namespace or metadata filtering if unavailable
        // .namespace(
        //     convertToAscii(fileKey)
        // )

        console.log("Inserting vectors into pinecone...");

        pineconeIndex.upsert(vectors);
    } else {
        throw new Error("Could not download file from S3!");
    }
}

export const truncateStringByBytes = (string: string, bytes: number) => {
    const encoder = new TextEncoder();
    return new TextDecoder("utf-8").decode(
        encoder.encode(string).slice(0, bytes)
    );
}

async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;

    // Replace newlines with empty string
    pageContent = pageContent.replace(/\n/g, "");

    // Split the docs
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 512,
        chunkOverlap: 20,
    });
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ]);

    return docs;
}

async function embedDocument(doc: Document, fileKey: string) {
    try {
        console.log("Embedding document...");
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                filterIndex: fileKey,
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as PineconeRecord;
    } catch (error) {
        console.log("Error embedding document", error);
        throw error;
    }
}