import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt = `${brand.tagline} — ${brand.descriptor}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#F7F5EF",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 20,
            letterSpacing: "0.2em",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#171B1E" }}>SALARY</span>
          <span style={{ color: "#0A263B" }}>SECURE</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 58,
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#171B1E",
            whiteSpace: "pre-wrap",
          }}
        >
          {"Your salary stops.\nYour backup starts."}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: "#66717A",
            maxWidth: 800,
          }}
        >
          {brand.ogSubtext}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 18,
            color: "#66717A",
          }}
        >
          Concept currently being validated · No live policy yet
        </div>
      </div>
    ),
    { ...size },
  );
}
