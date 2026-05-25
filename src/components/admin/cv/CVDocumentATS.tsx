import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import { CVData } from "./types";

Font.registerHyphenationCallback((word) => [word]);

const SITE_BASE = "https://www.amril-syaifa-yasin.my.id/en";
const resolveLink = (link: string) => link.startsWith("/") ? `${SITE_BASE}${link}` : link;

const PH = 44; // horizontal padding

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 0,
    lineHeight: 1.4,
  },

  // ── Top contact bar ──────────────────────────────────────
  contactBar: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: PH,
    paddingVertical: 7,
    alignItems: "center",
    marginTop: -32,
  },
  contactBarText: { fontSize: 8.5, color: "#555", textAlign: "center" },

  // ── Name block ───────────────────────────────────────────
  nameBlock: {
    paddingHorizontal: PH,
    paddingTop: 14,
    paddingBottom: 10,
    alignItems: "center",
  },
  nameText: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
  },
  roleText: {
    fontSize: 10,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
  },
  nameDivider: {
    borderBottomWidth: 0.75,
    borderBottomColor: "#888",
    marginHorizontal: PH,
    marginBottom: 0,
  },

  // ── Section rows ─────────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    paddingHorizontal: PH,
    paddingTop: 8,
  },
  sectionLabel: {
    width: "20%",
    paddingRight: 8,
  },
  sectionLabelText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    color: "#1a1a1a",
    textTransform: "uppercase",
    lineHeight: 1.3,
  },
  sectionContent: {
    width: "80%",
  },
  sectionDivider: {
    borderBottomWidth: 0.4,
    borderBottomColor: "#ccc",
    marginHorizontal: PH,
    marginTop: 8,
  },

  // ── Content styles ───────────────────────────────────────
  summaryText:  { fontSize: 9, lineHeight: 1.55, color: "#222" },

  bullet:     { flexDirection: "row", marginBottom: 2 },
  bulletDot:  { width: 10, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, color: "#222" },

  subLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },

  expRow:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  expTitle:   { fontSize: 10, fontFamily: "Helvetica-Bold" },
  expDates:   { fontSize: 9, color: "#444" },
  expCompany: { fontSize: 9, color: "#444", marginBottom: 4 },

  achBullet:  { flexDirection: "row", marginBottom: 2 },
  achDot:     { width: 10, fontSize: 9 },
  achText:    { flex: 1, fontSize: 9, color: "#222" },

  eduInst:    { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 1 },
  eduRow:     { flexDirection: "row", justifyContent: "space-between" },
  eduDegree:  { fontSize: 9, color: "#222" },
  eduYear:    { fontSize: 9, color: "#444" },
  eduGpa:     { fontSize: 9, color: "#444", marginTop: 1 },

  certText:   { fontSize: 9, color: "#222", marginBottom: 2 },
  portText:   { fontSize: 9, color: "#222", marginBottom: 2 },
  langText:   { fontSize: 9, color: "#222", marginBottom: 2 },
  linkText:   { fontSize: 9, color: "#222", marginBottom: 2 },

  skillPair:  { flexDirection: "row", marginBottom: 2 },
  skillCol:   { width: "50%" },
  skillText:  { fontSize: 9, color: "#222" },

  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#999",
  },
});

function formatDate(d: string): string {
  if (!d) return "";
  const [year, month] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function SectionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <View style={styles.sectionRow}>
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>{label}</Text>
        </View>
        <View style={styles.sectionContent}>
          {children}
        </View>
      </View>
      <View style={styles.sectionDivider} />
    </>
  );
}

export default function CVDocumentATS({ data }: { data: CVData }) {
  const includedCareers  = data.careers.filter(c => c.included);
  const includedSkills   = data.skills.filter(s => s.included);
  const includedCerts    = data.certifications.filter(c => c.included);
  const includedProjects = data.projects.filter(p => p.included);

  // Flatten all skill items into a single list for 2-column bullet grid
  const allSkillItems = includedSkills.flatMap(s => s.included_items);
  const skillPairs: [string, string | undefined][] = [];
  for (let i = 0; i < allSkillItems.length; i += 2) {
    skillPairs.push([allSkillItems[i], allSkillItems[i + 1]]);
  }

  // Links for WEBSITES / PORTFOLIOS / PROFILES
  const profileLinks = [
    data.portfolio_url ? { label: "Portfolio", value: data.portfolio_url } : null,
    data.linkedin      ? { label: "LinkedIn",  value: data.linkedin }      : null,
    data.github        ? { label: "GitHub",    value: data.github }        : null,
  ].filter(Boolean) as { label: string; value: string }[];

  // Contact bar: location | phone | email
  const contactBarParts = [data.location, data.phone, data.email].filter(Boolean);

  const hasLinks     = profileLinks.length > 0;
  const hasSummary   = !!data.summary;
  const hasSkills    = skillPairs.length > 0;
  const hasCareers   = includedCareers.length > 0;
  const hasEducation = data.education.length > 0;
  const hasCerts     = includedCerts.length > 0;
  const hasLanguages = data.languages.length > 0;
  const hasPortfolio = includedProjects.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── 1. Top contact bar ── */}
        <View style={styles.contactBar}>
          <Text style={styles.contactBarText}>
            {contactBarParts.join("  |  ")}
          </Text>
        </View>

        {/* ── 2. Name + role ── */}
        <View style={styles.nameBlock}>
          <Text style={styles.nameText}>{data.name}</Text>
          {(data.target_job || data.role) && (
            <Text style={styles.roleText}>{data.target_job || data.role}</Text>
          )}
        </View>
        <View style={styles.nameDivider} />

        {/* ── 3. Websites / Portfolios / Profiles ── */}
        {hasLinks && (
          <SectionRow label={"WEBSITES\nPORTFOLIOS\nPROFILES"}>
            {profileLinks.map((l, i) => (
              <Text key={i} style={styles.linkText}>• {l.value}</Text>
            ))}
          </SectionRow>
        )}

        {/* ── 4. Professional Summary ── */}
        {hasSummary && (
          <SectionRow label={"PROFESSIONAL\nSUMMARY"}>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </SectionRow>
        )}

        {/* ── 5. Skills ── */}
        {hasSkills && (
          <SectionRow label="SKILLS">
            {skillPairs.map(([left, right], i) => (
              <View key={i} style={styles.skillPair}>
                <View style={styles.skillCol}>
                  <Text style={styles.skillText}>• {left}</Text>
                </View>
                <View style={styles.skillCol}>
                  {right && <Text style={styles.skillText}>• {right}</Text>}
                </View>
              </View>
            ))}
          </SectionRow>
        )}

        {/* ── 6. Work History ── */}
        {hasCareers && (
          <SectionRow label={"WORK\nHISTORY"}>
            {includedCareers.map((c, ci) => {
              const workLines = (c.work_details ?? []).filter(d => d.trim() !== "");
              const achievements = c.achievements ?? [];
              return (
                <View key={c.id} style={{ marginBottom: ci < includedCareers.length - 1 ? 12 : 0 }}>
                  <View wrap={false}>
                    <View style={styles.expRow}>
                      <Text style={styles.expTitle}>{c.job_title}</Text>
                      <Text style={styles.expDates}>
                        {formatDate(c.start_date)} – {c.is_active ? "Present" : formatDate(c.end_date)}
                      </Text>
                    </View>
                    <Text style={styles.expCompany}>
                      {c.company}{c.job_location ? ` · ${c.job_location}` : ""}{c.job_tipe ? ` · ${c.job_tipe}` : ""}
                    </Text>
                  </View>

                  {/* Responsibilities */}
                  {workLines.length > 0 && (
                    <>
                      <Text style={styles.subLabel}>Responsibilities:</Text>
                      {workLines.map((d, i) => (
                        <View key={i} style={styles.bullet}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletText}>{d}</Text>
                        </View>
                      ))}
                    </>
                  )}

                  {/* Key Achievements */}
                  {achievements.length > 0 && (
                    <View style={{ marginTop: workLines.length > 0 ? 4 : 0 }}>
                      <Text style={styles.subLabel}>Key Achievements:</Text>
                      {achievements.map((a, i) => (
                        <View key={i} style={styles.achBullet}>
                          <Text style={styles.achDot}>•</Text>
                          <Text style={styles.achText}>
                            {a.year ? `${a.year}: ` : ""}{a.title}{a.description ? ` — ${a.description}` : ""}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </SectionRow>
        )}

        {/* ── 7. Education ── */}
        {hasEducation && (
          <SectionRow label="EDUCATION">
            {data.education.map((e, i) => (
              <View key={i} style={{ marginBottom: i < data.education.length - 1 ? 8 : 0 }}>
                <Text style={styles.eduInst}>{e.institution}</Text>
                <View style={styles.eduRow}>
                  <Text style={styles.eduDegree}>{e.degree}</Text>
                  <Text style={styles.eduYear}>{e.year}</Text>
                </View>
                {e.gpa && <Text style={styles.eduGpa}>GPA: {e.gpa}</Text>}
              </View>
            ))}
          </SectionRow>
        )}

        {/* ── 8. Certifications ── */}
        {hasCerts && (
          <SectionRow label="CERTIFICATIONS">
            {includedCerts.map((c, i) => (
              <View key={i} style={{ marginBottom: 2 }}>
                {c.href ? (
                  <Link src={c.href} style={[styles.certText, { textDecoration: "none" }]}>
                    • {c.title} — {c.issuer}{c.year ? ` | ${c.year}` : ""}
                  </Link>
                ) : (
                  <Text style={styles.certText}>
                    • {c.title} — {c.issuer}{c.year ? ` | ${c.year}` : ""}
                  </Text>
                )}
              </View>
            ))}
          </SectionRow>
        )}

        {/* ── 9. Languages ── */}
        {hasLanguages && (
          <SectionRow label="LANGUAGES">
            {data.languages.map((l, i) => (
              <Text key={i} style={styles.langText}>
                {l.name} ({l.proficiency})
              </Text>
            ))}
          </SectionRow>
        )}

        {/* ── 10. Portfolio ── */}
        {hasPortfolio && (
          <SectionRow label="PORTFOLIO">
            {includedProjects.map((p, i) => (
              <Text key={i} style={styles.portText}>
                • {p.title}{p.link ? ` — ${resolveLink(p.link)}` : ""}
              </Text>
            ))}
          </SectionRow>
        )}

        {/* Page number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
