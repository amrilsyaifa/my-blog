import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import { CVData } from "./types";

Font.registerHyphenationCallback((word) => [word]);

const SITE_BASE = "https://www.amril-syaifa-yasin.my.id/en";
const resolveLink = (link: string) => link.startsWith("/") ? `${SITE_BASE}${link}` : link;

const ACCENT = "#6366f1";
const DARK   = "#1e2130";
const LIGHT  = "#f8f8fc";
const MUTED  = "#64748b";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 48,
    paddingHorizontal: 0,
    lineHeight: 1.4,
  },
  banner: {
    backgroundColor: DARK,
    paddingHorizontal: 44,
    paddingTop: 28,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  photoWrapper: {
    width: 70, height: 70, borderRadius: 35,
    overflow: "hidden", borderWidth: 2, borderColor: ACCENT, flexShrink: 0,
  },
  photo: { width: 70, height: 70, borderRadius: 35 },
  photoPlaceholder: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: ACCENT, alignItems: "center", justifyContent: "center",
  },
  bannerRight:  { flex: 1 },
  bannerName:   { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#fff", marginBottom: 3 },
  bannerRole:   { fontSize: 10, color: "#a5b4fc", marginBottom: 5 },
  contactGrid:  { flexDirection: "row", flexWrap: "wrap" },
  contactItem:  { fontSize: 8, color: "#cbd5e1", marginRight: 10, marginBottom: 2 },
  body:         { paddingHorizontal: 44, paddingTop: 14 },
  // Section header — border on View for full width
  sectionHeaderWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ff",
    marginTop: 12,
    marginBottom: 5,
    paddingBottom: 2,
  },
  sectionHeaderText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    letterSpacing: 1.2,
  },
  summaryText: { fontSize: 9.5, color: "#374151", lineHeight: 1.55 },
  expRow:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  expTitle:   { fontSize: 10, fontFamily: "Helvetica-Bold", color: DARK },
  expDates:   { fontSize: 8.5, color: MUTED },
  expCompany: { fontSize: 9, color: MUTED, marginBottom: 3 },
  bullet:     { flexDirection: "row", marginBottom: 1.5, paddingLeft: 8 },
  bulletDot:  { width: 10, fontSize: 9, color: ACCENT },
  bulletText: { flex: 1, fontSize: 9, color: "#374151" },
  achievementsLabel: {
    fontSize: 9, fontFamily: "Helvetica-Bold", color: ACCENT,
    marginTop: 3, marginBottom: 1.5, paddingLeft: 8,
  },
  achBullet:  { flexDirection: "row", marginBottom: 1.5, paddingLeft: 16 },
  achDot:     { width: 10, fontSize: 9, color: "#f59e0b" },
  achText:    { flex: 1, fontSize: 9, color: "#374151" },
  eduRow:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  eduDegree:  { fontSize: 10, fontFamily: "Helvetica-Bold" },
  eduYear:    { fontSize: 9, color: MUTED },
  eduInst:    { fontSize: 9, color: MUTED },
  skillRow:   { marginBottom: 3 },
  skillCat:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: ACCENT, marginBottom: 1 },
  skillItems: {
    fontSize: 9, color: "#374151",
    backgroundColor: LIGHT, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 3,
  },
  certRow:    { flexDirection: "row", marginBottom: 2 },
  certDot:    { width: 8, fontSize: 9, color: ACCENT },
  certText:   { flex: 1, fontSize: 9, color: "#374151" },
  portRow:    { flexDirection: "row", marginBottom: 2 },
  portDot:    { width: 8, fontSize: 9, color: ACCENT },
  portText:   { flex: 1, fontSize: 9, color: "#374151" },
  langText:   { fontSize: 9, color: "#374151" },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#94a3b8",
  },
});

function SectionHead({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeaderWrapper}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

function formatDate(d: string): string {
  if (!d) return "";
  const [year, month] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export default function CVDocumentVisual({ data }: { data: CVData }) {
  const includedCareers  = data.careers.filter(c => c.included);
  const includedSkills   = data.skills.filter(s => s.included);
  const includedCerts    = data.certifications.filter(c => c.included);
  const includedProjects = data.projects.filter(p => p.included);

  const contactItems = [data.email, data.phone, data.linkedin, data.github, data.portfolio_url, data.location].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top dark banner */}
        <View style={styles.banner}>
          <View style={styles.photoWrapper}>
            {data.photo_url ? (
              <Image style={styles.photo} src={data.photo_url} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={{ color: "#fff", fontSize: 18, fontFamily: "Helvetica-Bold" }}>
                  {data.name?.[0] ?? "?"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerName}>{data.name}</Text>
            <Text style={styles.bannerRole}>{data.target_job || data.role}</Text>
            <View style={styles.contactGrid}>
              {contactItems.map((c, i) => <Text key={i} style={styles.contactItem}>{c}</Text>)}
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* Summary */}
          {data.summary ? (
            <>
              <SectionHead title="PROFESSIONAL SUMMARY" />
              <Text style={styles.summaryText}>{data.summary}</Text>
            </>
          ) : null}

          {/* Experience */}
          {includedCareers.length > 0 && (
            <>
              <SectionHead title="PROFESSIONAL EXPERIENCE" />
              {includedCareers.map(c => (
                <View key={c.id} style={{ marginBottom: 8 }}>
                  <View style={styles.expRow}>
                    <Text style={styles.expTitle}>{c.job_title}</Text>
                    <Text style={styles.expDates}>
                      {formatDate(c.start_date)} – {c.is_active ? "Present" : formatDate(c.end_date)}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>
                    {c.company}{c.job_location ? ` · ${c.job_location}` : ""}{c.job_tipe ? ` · ${c.job_tipe}` : ""}
                  </Text>
                  {(c.work_details ?? []).map((d, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletDot}>▸</Text>
                      <Text style={styles.bulletText}>{d}</Text>
                    </View>
                  ))}
                  {(c.achievements ?? []).length > 0 && (
                    <>
                      <Text style={styles.achievementsLabel}>Key Achievements:</Text>
                      {c.achievements.map((a, i) => (
                        <View key={i} style={styles.achBullet}>
                          <Text style={styles.achDot}>★</Text>
                          <Text style={styles.achText}>
                            {a.year ? `${a.year}: ` : ""}{a.title}{a.description ? ` — ${a.description}` : ""}
                          </Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              ))}
            </>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <>
              <SectionHead title="EDUCATION" />
              {data.education.map((e, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <View style={styles.eduRow}>
                    <Text style={styles.eduDegree}>{e.degree}</Text>
                    <Text style={styles.eduYear}>{e.year}</Text>
                  </View>
                  <Text style={styles.eduInst}>{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</Text>
                </View>
              ))}
            </>
          )}

          {/* Skills */}
          {includedSkills.length > 0 && (
            <>
              <SectionHead title="SKILLS" />
              {includedSkills.map(s => (
                <View key={s.id} style={styles.skillRow}>
                  <Text style={styles.skillCat}>{s.name}</Text>
                  <Text style={styles.skillItems}>{s.data.join("  ·  ")}</Text>
                </View>
              ))}
            </>
          )}

          {/* Certifications */}
          {includedCerts.length > 0 && (
            <>
              <SectionHead title="CERTIFICATIONS" />
              {includedCerts.map(c => (
                <View key={c.id} style={styles.certRow}>
                  <Text style={styles.certDot}>◆</Text>
                  {c.href ? (
                    <Link src={c.href} style={[styles.certText, { textDecoration: "none" }]}>
                      {c.title} — {c.issuer}{c.year ? ` | ${c.year}` : ""}
                    </Link>
                  ) : (
                    <Text style={styles.certText}>{c.title} — {c.issuer}{c.year ? ` | ${c.year}` : ""}</Text>
                  )}
                </View>
              ))}
            </>
          )}

          {/* Portfolio */}
          {includedProjects.length > 0 && (
            <>
              <SectionHead title="PORTFOLIO" />
              {includedProjects.map(p => (
                <View key={p.id} style={styles.portRow}>
                  <Text style={styles.portDot}>◈</Text>
                  <Text style={styles.portText}>{p.title}{p.link ? ` — ${resolveLink(p.link)}` : ""}</Text>
                </View>
              ))}
            </>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <>
              <SectionHead title="LANGUAGES" />
              <Text style={styles.langText}>
                {data.languages.map(l => `${l.name} (${l.proficiency})`).join("  ·  ")}
              </Text>
            </>
          )}
        </View>

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
