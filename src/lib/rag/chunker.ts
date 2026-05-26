export interface Chunk {
  id:       string;
  text:     string;
  metadata: Record<string, string>;
}

function fmt(date: string) {
  if (!date) return "";
  const [y, m] = date.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export function buildChunks(data: {
  about:          Record<string, unknown>;
  cvProf:         Record<string, unknown>;
  careers:        Record<string, unknown>[];
  skills:         Record<string, unknown>[];
  certifications: Record<string, unknown>[];
  projects:       Record<string, unknown>[];
  community:      Record<string, unknown>[];
}): Chunk[] {
  const chunks: Chunk[] = [];

  // ── Profile / bio ────────────────────────────────────────────────────────
  const expStart = (data.about.experience_start as string) ?? "";
  const yearsExp = expStart
    ? Math.floor((Date.now() - new Date(expStart).getTime()) / 31557600000)
    : null;

  chunks.push({
    id: "profile-0",
    metadata: { type: "profile", title: "Professional Profile" },
    text: [
      `Name: ${data.about.name ?? data.cvProf.name ?? ""}`,
      `Role: ${data.about.role ?? data.cvProf.role ?? ""}`,
      `Location: ${data.about.location ?? data.cvProf.location ?? ""}`,
      yearsExp ? `Years of Experience: ${yearsExp}+` : "",
      data.about.greeting_en ? `Bio: ${data.about.greeting_en}` : "",
      data.about.interests ? `Interests: ${data.about.interests}` : "",
      data.cvProf.summary ? `Professional Summary: ${data.cvProf.summary}` : "",
      data.cvProf.target_job ? `Target Job: ${data.cvProf.target_job}` : "",
    ].filter(Boolean).join("\n"),
  });

  // ── Contact ──────────────────────────────────────────────────────────────
  chunks.push({
    id: "contact-0",
    metadata: { type: "contact", title: "Contact Information" },
    text: [
      `Email: ${data.cvProf.email ?? ""}`,
      `Phone: ${data.cvProf.phone ?? ""}`,
      `LinkedIn: ${data.cvProf.linkedin ?? ""}`,
      `GitHub: ${data.cvProf.github ?? ""}`,
      `Portfolio: ${data.cvProf.portfolio_url ?? ""}`,
    ].filter(l => l.split(": ")[1]).join("\n"),
  });

  // ── Education ────────────────────────────────────────────────────────────
  const edu = (data.cvProf.education as { degree: string; institution: string; year: string; gpa?: string }[]) ?? [];
  if (edu.length > 0) {
    chunks.push({
      id: "education-0",
      metadata: { type: "education", title: "Education" },
      text: "Education:\n" + edu.map(e =>
        `${e.degree} — ${e.institution} (${e.year})${e.gpa ? `, GPA ${e.gpa}` : ""}`
      ).join("\n"),
    });
  }

  // ── Languages ────────────────────────────────────────────────────────────
  const langs = (data.cvProf.languages as { name: string; proficiency: string }[]) ?? [];
  if (langs.length > 0) {
    chunks.push({
      id: "languages-0",
      metadata: { type: "languages", title: "Languages" },
      text: "Spoken Languages: " + langs.map(l => `${l.name} (${l.proficiency})`).join(", "),
    });
  }

  // ── Careers ──────────────────────────────────────────────────────────────
  for (const c of data.careers) {
    const id         = c.id as string;
    const stack      = (c.dev_stack as string[]) ?? [];
    const details    = (c.work_details as string[]) ?? [];
    const ach        = (c.achievements as { year?: string; title: string; description?: string }[]) ?? [];
    const dateRange  = `${fmt(c.start_date as string)} – ${c.is_active ? "Present" : fmt(c.end_date as string)}`;

    chunks.push({
      id: `career-${id}`,
      metadata: { type: "career", title: `${c.job_title} at ${c.company}` },
      text: [
        `Job Title: ${c.job_title}`,
        `Company: ${c.company}`,
        `Period: ${dateRange}`,
        c.job_location ? `Location: ${c.job_location}` : "",
        c.job_tipe    ? `Type: ${c.job_tipe}` : "",
        stack.length  ? `Technologies: ${stack.join(", ")}` : "",
        details.length ? `Responsibilities:\n${details.map(d => `- ${d}`).join("\n")}` : "",
        ach.length ? `Key Achievements:\n${ach.map(a => `- ${a.year ? a.year + ": " : ""}${a.title}${a.description ? " — " + a.description : ""}`).join("\n")}` : "",
      ].filter(Boolean).join("\n"),
    });
  }

  // ── Skills ───────────────────────────────────────────────────────────────
  for (const s of data.skills) {
    const items = (s.data as string[]) ?? [];
    if (!items.length) continue;
    chunks.push({
      id: `skill-${s.id as string}`,
      metadata: { type: "skill", title: s.name as string },
      text: `Skill Category: ${s.name}\nSkills: ${items.join(", ")}`,
    });
  }

  // ── Certifications ───────────────────────────────────────────────────────
  for (const c of data.certifications) {
    chunks.push({
      id: `cert-${c.id as string}`,
      metadata: { type: "certification", title: c.title as string },
      text: `Certification: ${c.title}\nIssued by: ${c.issuer}${c.year ? `\nYear: ${c.year}` : ""}${c.href ? `\nLink: ${c.href}` : ""}`,
    });
  }

  // ── Projects ─────────────────────────────────────────────────────────────
  for (const p of data.projects) {
    const stack = ((p.dev_stack as { title: string }[]) ?? []).map(d => d.title);
    chunks.push({
      id: `project-${p.id as string}`,
      metadata: { type: "project", title: (p.title_en ?? p.title) as string },
      text: [
        `Project: ${(p.title_en ?? p.title) as string}`,
        `Description: ${(p.description_en ?? p.description) as string ?? ""}`,
        stack.length ? `Tech Stack: ${stack.join(", ")}` : "",
        p.link ? `Link: ${p.link as string}` : "",
        `Type: ${p.project_by === "self" ? "Personal project" : "Company project"}`,
      ].filter(Boolean).join("\n"),
    });
  }

  // ── Community ────────────────────────────────────────────────────────────
  for (const c of data.community) {
    chunks.push({
      id: `community-${c.id as string}`,
      metadata: { type: "community", title: (c.title_en ?? c.title) as string },
      text: [
        `Community Event: ${(c.title_en ?? c.title) as string}`,
        c.date     ? `Date: ${c.date as string}` : "",
        c.location ? `Location: ${c.location as string}` : "",
        (c.description_en ?? c.description) ? `Description: ${(c.description_en ?? c.description) as string}` : "",
      ].filter(Boolean).join("\n"),
    });
  }

  return chunks.filter(ch => ch.text.trim().length > 10);
}
