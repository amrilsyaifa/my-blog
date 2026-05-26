import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "ap-southeast-1",
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME!;
const PREFIX = "rag-pdfs/";

export async function uploadPdf(filename: string, buffer: Buffer): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         `${PREFIX}${filename}`,
    Body:        buffer,
    ContentType: "application/pdf",
  }));
}

export async function deletePdf(filename: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key:    `${PREFIX}${filename}`,
  }));
}

export async function listPdfs(): Promise<string[]> {
  const res = await s3.send(new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: PREFIX,
  }));
  return (res.Contents ?? [])
    .map(o => o.Key?.replace(PREFIX, "") ?? "")
    .filter(Boolean);
}
