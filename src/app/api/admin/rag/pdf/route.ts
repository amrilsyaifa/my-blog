import { NextRequest, NextResponse } from "next/server";
import { pdfToChunks, sanitizeFilename } from "@components/lib/rag/pdf";
import { embedText } from "@components/lib/rag/gemini";
import { upsertVectors, deleteVectorsByPrefix } from "@components/lib/rag/s3vectors";
import { uploadPdf, deletePdf } from "@components/lib/rag/s3files";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

function isAdmin(req: NextRequest): boolean {
  return req.headers.get("x-admin-email") === ADMIN_EMAIL && !!ADMIN_EMAIL;
}

export interface PdfRecord {
  filename:   string;
  uploadedAt: string;
  chunkCount: number;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const buffer   = Buffer.from(await file.arrayBuffer());
    const chunks   = await pdfToChunks(buffer, file.name);
    const safe     = sanitizeFilename(file.name.replace(/\.pdf$/i, ""));

    // Store original PDF in regular S3 bucket (for archival / future re-indexing)
    await uploadPdf(file.name, buffer);

    // Delete old vectors for this file
    await deleteVectorsByPrefix(`pdf-${safe}-`);

    // Embed and upsert
    const vectorChunks = [];
    for (const chunk of chunks) {
      const vector = await embedText(chunk.text);
      vectorChunks.push({ ...chunk, vector });
    }
    await upsertVectors(vectorChunks);

    return NextResponse.json({ filename: file.name, chunkCount: chunks.length });
  } catch (err) {
    console.error("[rag/pdf]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = await req.json() as { filename: string };
    const safe = sanitizeFilename(filename.replace(/\.pdf$/i, ""));

    // Delete original file from S3 and vectors from S3 Vectors
    await Promise.all([
      deletePdf(filename),
      deleteVectorsByPrefix(`pdf-${safe}-`),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[rag/pdf delete]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
