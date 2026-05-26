import { NextRequest, NextResponse } from "next/server";
import { classifyIntent, embedText, streamAnswer } from "@components/lib/rag/gemini";
import { queryVectors } from "@components/lib/rag/s3vectors";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@components/configs/firebase";

// Model config cache — refreshed every 2 minutes so admin changes take effect quickly
let modelCache: { model: string; expiresAt: number } = { model: "", expiresAt: 0 };

async function getChatModel(): Promise<string | undefined> {
  if (Date.now() < modelCache.expiresAt) return modelCache.model || undefined;
  try {
    const snap = await getDoc(doc(db, "rag", "config"));
    const model = snap.exists() ? ((snap.data().model as string) || "") : "";
    modelCache = { model, expiresAt: Date.now() + 2 * 60 * 1000 };
    return model || undefined;
  } catch {
    modelCache = { model: "", expiresAt: Date.now() + 30_000 };
    return undefined;
  }
}

// Simple in-memory per-IP rate limiter (resets on cold start)
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const LIMIT = 20;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now  = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    ({ messages } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find(m => m.role === "user");
  if (!lastUser) return NextResponse.json({ error: "No user message" }, { status: 400 });

  const DENY_MESSAGE    = "Saya hanya dapat menjawab pertanyaan terkait CV, pengalaman kerja, skill, dan project Amril.";
  const QUOTA_MESSAGE   = "Maaf, layanan AI sedang mencapai batas penggunaan. Silakan coba lagi dalam beberapa saat.";

  const textStream = (text: string) => {
    const encoder = new TextEncoder();
    return new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    });
  };

  const streamHeaders = {
    "Content-Type":     "text/plain; charset=utf-8",
    "Cache-Control":    "no-cache",
    "X-Accel-Buffering": "no",
  } as const;

  try {
    // 1. Intent classification (rule-based, no API call)
    const intent = classifyIntent(lastUser.content);
    if (intent === "DENY") {
      return new Response(textStream(DENY_MESSAGE), { headers: streamHeaders });
    }

    // 2. Embed query
    const embedding = await embedText(lastUser.content);

    // 3. Retrieve context
    const results = await queryVectors(embedding, 5);
    const context = results
      .map(r => r.text)
      .filter(Boolean)
      .join("\n\n---\n\n");

    // 4. Build chat history in OpenAI format (exclude last user message — it goes as the prompt)
    const history = messages.slice(0, -1).map(m => ({
      role:    m.role === "user" ? "user" as const : "assistant" as const,
      content: m.content,
    }));

    // 5. Stream answer (model from Firestore config, fallback to env/default)
    const model  = await getChatModel();
    const stream = await streamAnswer(lastUser.content, context, history, model);

    return new Response(stream, { headers: streamHeaders });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests")) {
      console.warn("[chat] Gemini quota exceeded");
      return new Response(textStream(QUOTA_MESSAGE), { headers: streamHeaders });
    }
    console.error("[chat]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
