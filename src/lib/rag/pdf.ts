import type { Chunk } from "./chunker";

export function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
}

export async function pdfToChunks(buffer: Buffer, filename: string): Promise<Chunk[]> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  const text   = result.text as string;
  await parser.destroy();

  const WORDS_PER_CHUNK = 500;
  const WORDS_OVERLAP   = 80;
  const safe            = sanitizeFilename(filename.replace(/\.pdf$/i, ""));
  const words           = text.split(/\s+/).filter(Boolean);
  const chunks: Chunk[] = [];

  let i = 0;
  let idx = 0;
  while (i < words.length) {
    const slice = words.slice(i, i + WORDS_PER_CHUNK).join(" ");
    if (slice.trim().length > 20) {
      chunks.push({
        id:       `pdf-${safe}-${idx}`,
        text:     slice,
        metadata: { type: "pdf", filename, title: filename },
      });
      idx++;
    }
    i += WORDS_PER_CHUNK - WORDS_OVERLAP;
  }

  return chunks;
}
