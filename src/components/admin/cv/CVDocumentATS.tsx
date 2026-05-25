import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CVData } from "./types";

Font.registerHyphenationCallback((word) => [word]);

const SITE_BASE = "https://www.amril-syaifa-yasin.my.id/en";
const resolveLink = (link: string) => link.startsWith("/") ? `${SITE_BASE}${link}` : link;


const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 44,
    lineHeight: 1.4,
  },
  name:         { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  roleLocation: { fontSize: 10, color: "#444", marginBottom: 3 },
  contactLine:  { fontSize: 9,  color: "#444", marginBottom: 8 },
  divider:      { borderBottomWidth: 0.75, borderBottomColor: "#888", marginBottom: 10 },
  // Section header — border on View so it spans full width
  sectionHeaderWrapper: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbb",
    marginTop: 10,
    marginBottom: 5,
    paddingBottom: 2,
  },
  sectionHeaderText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
  },
  expRow:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  expTitle:   { fontSize: 10, fontFamily: "Helvetica-Bold" },
  expDates:   { fontSize: 9,  color: "#444" },
  expCompany: { fontSize: 9,  color: "#444", marginBottom: 3 },
  bullet:     { flexDirection: "row", marginBottom: 1.5, paddingLeft: 8 },
  bulletDot:  { width: 10, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9 },
  achievementsLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", marginTop: 3, marginBottom: 1.5, paddingLeft: 8 },
  achBullet:  { flexDirection: "row", marginBottom: 1.5, paddingLeft: 16 },
  achDot:     { width: 10, fontSize: 9 },
  achText:    { flex: 1, fontSize: 9 },
  eduRow:     { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  eduDegree:  { fontSize: 10, fontFamily: "Helvetica-Bold" },
  eduYear:    { fontSize: 9,  color: "#444" },
  eduInst:    { fontSize: 9,  color: "#444" },
  skillRow:   { marginBottom: 2 },
  skillText:  { fontSize: 9 },
  certRow:    { marginBottom: 2 },
  certText:   { fontSize: 9 },
  portRow:    { marginBottom: 2 },
  portText:   { fontSize: 9 },
  summaryText:{ fontSize: 9, lineHeight: 1.5 },
  langText:   { fontSize: 9 },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#888",
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

export default function CVDocumentATS({ data }: { data: CVData }) {
  const includedCareers = data.careers.filter(c => c.included);
  const includedSkills  = data.skills.filter(s => s.included);
  const includedCerts   = data.certifications.filter(c => c.included);
  const includedProjects = data.projects.filter(p => p.included);

  const contactParts = [data.email, data.phone, data.linkedin, data.github, data.portfolio_url].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.roleLocation}>
          {[data.target_job || data.role, data.location].filter(Boolean).join(" · ")}
        </Text>
        {contactParts.length > 0 && (
          <Text style={styles.contactLine}>{contactParts.join(" | ")}</Text>
        )}
        <View style={styles.divider} />

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
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{d}</Text>
                  </View>
                ))}
                {(c.achievements ?? []).length > 0 && (
                  <>
                    <Text style={styles.achievementsLabel}>Key Achievements:</Text>
                    {c.achievements.map((a, i) => (
                      <View key={i} style={styles.achBullet}>
                        <Text style={styles.achDot}>•</Text>
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
                <Text style={styles.skillText}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>{s.name}: </Text>
                  {s.data.join(", ")}
                </Text>
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
                <Text style={styles.certText}>
                  {c.title} — {c.issuer}{c.year ? ` | ${c.year}` : ""}
                </Text>
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
                <Text style={styles.portText}>
                  • {p.title}{p.link ? ` — ${resolveLink(p.link)}` : ""}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <>
            <SectionHead title="LANGUAGES" />
            <Text style={styles.langText}>
              {data.languages.map(l => `${l.name} (${l.proficiency})`).join(" · ")}
            </Text>
          </>
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
