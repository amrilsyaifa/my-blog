import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { buildChunks } from "@components/lib/rag/chunker";
import { embedText } from "@components/lib/rag/gemini";
import { upsertVectors, deleteVectorsByPrefix } from "@components/lib/rag/s3vectors";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

function isAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-email");
  return auth === ADMIN_EMAIL && !!ADMIN_EMAIL;
}

const PREFIXES = ["profile-", "contact-", "education-", "languages-", "career-", "skill-", "cert-", "project-", "community-"];

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all Firestore data in parallel
    const [aboutSnap, cvSnap, careersSnap, skillsSnap, certsSnap, projectsSnap, communitySnap] = await Promise.all([
      getDoc(doc(db, "about", "profile")),
      getDoc(doc(db, "cv", "profile")),
      getDocs(collection(db, "careers")),
      getDocs(collection(db, "skills")),
      getDocs(collection(db, "certifications")),
      getDocs(collection(db, "projects")),
      getDocs(collection(db, "community")),
    ]);

    const about  = aboutSnap.exists() ? (aboutSnap.data() as Record<string, unknown>) : {};
    const cvProf = cvSnap.exists()    ? (cvSnap.data()    as Record<string, unknown>) : {};

    const firestoreData = {
      about,
      cvProf,
      careers:        careersSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      skills:         skillsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      certifications: certsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      projects:       projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      community:      communitySnap.docs.map(d => ({ id: d.id, ...d.data() })),
    };

    // Build text chunks
    const chunks = buildChunks(firestoreData as Parameters<typeof buildChunks>[0]);

    // Delete stale vectors before re-indexing
    await Promise.all(PREFIXES.map(p => deleteVectorsByPrefix(p)));

    // Embed all chunks (sequential to respect free tier rate limits)
    const vectorChunks = [];
    for (const chunk of chunks) {
      const vector = await embedText(chunk.text);
      vectorChunks.push({ ...chunk, vector });
    }

    // Upsert to S3 Vectors
    await upsertVectors(vectorChunks);

    return NextResponse.json({ ok: true, chunkCount: chunks.length });
  } catch (err) {
    console.error("[rag/sync]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
