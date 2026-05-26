import { NextResponse } from "next/server";

export interface ModelOption {
  id:      string;
  name:    string;
  context: number;
}

export async function GET() {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      next: { revalidate: 300 }, // cache 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch models" }, { status: 502 });
    }

    const json = await res.json() as {
      data: { id: string; name: string; context_length: number; pricing: { prompt: string | number } }[]
    };

    const free: ModelOption[] = json.data
      .filter(m => m.pricing?.prompt === "0" || m.pricing?.prompt === 0)
      .map(m => ({ id: m.id, name: m.name ?? m.id, context: m.context_length ?? 0 }))
      .sort((a, b) => b.context - a.context);

    return NextResponse.json({ models: free });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
