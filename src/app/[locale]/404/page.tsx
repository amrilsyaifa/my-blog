"use client";
// comm

import Navigation from "@components/components/Navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NotFoundPage() {
  const { locale } = useParams();
  const t = useTranslations("404");

  return (
    <div className="container">
      <Navigation locale={locale as string} />

      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{ fontSize: "72px", color: "#FF0000", margin: "0 0 10px 0" }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "36px",
            color: "#FFFF00",
            margin: "0 0 20px 0",
          }}
        >
          {t("title")}
        </h2>
      </div>

      <div className="content-wrapper" style={{ marginBottom: "20px" }}>
        <div style={{ textAlign: "center", color: "#000000" }}>
          <div
            style={{
              fontSize: "18px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            ERROR: 404 - FILE NOT FOUND
          </div>
          <div
            style={{
              backgroundColor: "#000080",
              color: "#00FF00",
              padding: "16px",
              fontFamily: "Courier New, monospace",
              textAlign: "left",
              marginBottom: "20px",
              border: "2px solid #00FF00",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            C:\INTERNET\WEBSITE\{`>`}_ The page you requested does not exist.
            <br />
            C:\INTERNET\WEBSITE\{`>`}_ This is very embarrassing...
            <br />
            C:\INTERNET\WEBSITE\{`>`}_ Our webmaster has been notified.
            <br />
            C:\INTERNET\WEBSITE\{`>`}_ Press F5 to refresh (it won&apos;t help)
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ margin: "0 0 10px 0", color: "#000000" }}>
              Sorry! The page you&apos;re looking for has disappeared into the
              digital void.
            </p>
            <p style={{ margin: "0", color: "#000000", fontSize: "14px" }}>
              It may have been deleted, moved, or never existed at all.
            </p>
          </div>
        </div>
      </div>

      <div className="content-wrapper" style={{ marginBottom: "20px" }}>
        <h3 style={{ color: "#0000FF", marginTop: "0" }}>What you can do:</h3>
        <ul style={{ color: "#000000", marginLeft: "20px" }}>
          <li>Check the URL for typos</li>
          <li>Click the back button in your browser</li>
          <li>Visit the homepage and try again</li>
          <li>Check your bookmarks</li>
          <li>Email the webmaster about this broken link</li>
        </ul>
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Link href={`/${locale}`}>
          <button
            style={{
              backgroundColor: "#0000FF",
              color: "#FFFF00",
              border: "3px outset #0080FF",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0080FF";
              e.currentTarget.style.borderStyle = "inset";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0000FF";
              e.currentTarget.style.borderStyle = "outset";
            }}
          >
            {t("back_home")}
          </button>
        </Link>

        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: "#C0C0C0",
            color: "#000000",
            border: "2px outset #DFDFDF",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderStyle = "inset";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderStyle = "outset";
          }}
        >
          Go Back
        </button>
      </div>

      <div className="under-construction" style={{ marginBottom: "20px" }}>
        This page is definitely under construction! Or maybe it&apos;s just
        LOST!
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#C0C0C0",
          marginTop: "20px",
        }}
      >
        <tbody>
          <tr>
            <td
              colSpan={2}
              style={{
                backgroundColor: "#000080",
                color: "#FFFF00",
                padding: "8px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ERROR DETAILS
            </td>
          </tr>
          <tr>
            <td
              style={{
                borderBottom: "1px solid #808080",
                padding: "6px",
                fontWeight: "bold",
              }}
            >
              Error Code:
            </td>
            <td style={{ borderBottom: "1px solid #808080", padding: "6px" }}>
              404
            </td>
          </tr>
          <tr>
            <td
              style={{
                borderBottom: "1px solid #808080",
                padding: "6px",
                fontWeight: "bold",
              }}
            >
              Status:
            </td>
            <td style={{ borderBottom: "1px solid #808080", padding: "6px" }}>
              Not Found
            </td>
          </tr>
          <tr>
            <td
              style={{
                borderBottom: "1px solid #808080",
                padding: "6px",
                fontWeight: "bold",
              }}
            >
              Requested Resource:
            </td>
            <td style={{ borderBottom: "1px solid #808080", padding: "6px" }}>
              <code style={{ fontSize: "11px" }}>
                {typeof window !== "undefined" ? window.location.pathname : "/"}
              </code>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px", fontWeight: "bold" }}>Browser:</td>
            <td style={{ padding: "6px" }}>
              {typeof navigator !== "undefined"
                ? navigator.userAgent.slice(0, 50)
                : "Unknown"}
              ...
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          color: "#CCCCCC",
          fontSize: "12px",
        }}
      >
        <hr style={{ borderTop: "1px dashed #FFFF00" }} />
        <p style={{ margin: "10px 0" }}>
          This website best viewed in Netscape Navigator 4.0 or higher
        </p>
        <p style={{ margin: "10px 0" }}>
          If you continue to have problems, please{" "}
          <a href="mailto:amrilsyaifa@gmail.com" style={{ color: "#0000FF" }}>
            email the webmaster
          </a>
        </p>
      </div>
    </div>
  );
}
