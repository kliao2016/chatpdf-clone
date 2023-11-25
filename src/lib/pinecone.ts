import "server-only";
import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getEmbeddings } from './embeddings';
import md5 from "md5";
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';
import { pineconeClient } from "./pinecone-client";
import { fulfilledAndDefinedPromises } from "./utils";

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
    const fileName = await downloadFromS3(fileKey).catch((error) => {
        throw error;
    });
    if (fileName) {
        console.log(`Loaded ${fileName} from S3`);
        const loader = new PDFLoader(fileName);

        let pages: PDFPage[] = [];
        try {
            // TODO: This cast can be fragile
            pages = await loader.load() as PDFPage[];
        } catch (error) {
            throw error;
        }

        // 2. Split and segment pdf into smaller parts for better vectorization
        const splitDocuments = await fulfilledAndDefinedPromises<Document[]>(
            pages.map(splitPage)
        );

        // 3. Vectorize and embed invidual documents
        const vectors = await fulfilledAndDefinedPromises<PineconeRecord<RecordMetadata>>(
            splitDocuments
                .flat()
                .map(async (doc: Document) => {
                    return embedDocument(doc, fileKey);
                })
        );

        // 4. Upload vectors to pinecone
        const pineconeIndex = pineconeClient.Index(
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

async function splitPage(page: PDFPage) {
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
                pageNumber: metadata?.loc?.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ]).catch((error) => {
        throw error;
    });

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