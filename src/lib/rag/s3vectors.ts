import {
  S3VectorsClient,
  PutVectorsCommand,
  QueryVectorsCommand,
  ListVectorsCommand,
  DeleteVectorsCommand,
} from "@aws-sdk/client-s3vectors";

const client = new S3VectorsClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_VECTOR_BUCKET_NAME!;
const INDEX  = process.env.S3_VECTOR_INDEX_NAME ?? "portfolio-knowledge";

export interface VectorChunk {
  id:       string;
  vector:   number[];
  metadata: Record<string, string>;
  text:     string;
}

export async function upsertVectors(chunks: VectorChunk[]): Promise<void> {
  const BATCH = 500;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    await client.send(new PutVectorsCommand({
      vectorBucketName: BUCKET,
      indexName:        INDEX,
      vectors: batch.map(c => ({
        key:      c.id,
        data:     { float32: c.vector },
        metadata: { ...c.metadata, text: c.text },
      })),
    }));
  }
}

export async function queryVectors(
  embedding: number[],
  topK = 5
): Promise<{ id: string; text: string; metadata: Record<string, string> }[]> {
  const res = await client.send(new QueryVectorsCommand({
    vectorBucketName: BUCKET,
    indexName:        INDEX,
    queryVector:      { float32: embedding },
    topK,
    returnMetadata:   true,
  }));

  return (res.vectors ?? []).map(v => {
    const meta = (v.metadata ?? {}) as Record<string, unknown>;
    return {
      id:       v.key ?? "",
      text:     (meta.text as string) ?? "",
      metadata: meta as Record<string, string>,
    };
  });
}

export async function deleteVectorsByPrefix(prefix: string): Promise<void> {
  let nextToken: string | undefined;
  const keysToDelete: string[] = [];

  do {
    const res = await client.send(new ListVectorsCommand({
      vectorBucketName: BUCKET,
      indexName:        INDEX,
      nextToken,
      maxResults:       1000,
    }));

    for (const v of res.vectors ?? []) {
      if (v.key?.startsWith(prefix)) keysToDelete.push(v.key);
    }
    nextToken = res.nextToken;
  } while (nextToken);

  const BATCH = 500;
  for (let i = 0; i < keysToDelete.length; i += BATCH) {
    await client.send(new DeleteVectorsCommand({
      vectorBucketName: BUCKET,
      indexName:        INDEX,
      keys:             keysToDelete.slice(i, i + BATCH),
    }));
  }
}
