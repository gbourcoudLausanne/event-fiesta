import { ImageResponse } from "next/og";

export const alt = "Event Fiesta — Décoration d'événements sur mesure · Lausanne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background:
            "linear-gradient(140deg, #FAF7F2 0%, #F3EDE6 55%, #F2D4D9 140%)",
          position: "relative",
        }}
      >
        {/* ballons décoratifs */}
        <div
          style={{
            position: "absolute",
            top: -90,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 34% 30%, #FBE0E9, #EDA9C0 55%, #D083A0)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -110,
            right: 150,
            width: 220,
            height: 220,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 34% 30%, #EFF7FB, #AAD0E2 55%, #7FB0C6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: -50,
            width: 160,
            height: 160,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 34% 30%, #FFF4E7, #F3C6A0 55%, #D79A6D)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#B65572",
            marginBottom: 28,
          }}
        >
          Lausanne · Suisse romande
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#2A2320",
            lineHeight: 1,
          }}
        >
          Event Fiesta
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: "rgba(42,35,32,0.62)",
            marginTop: 30,
            maxWidth: 760,
          }}
        >
          Décoration d'événements sur mesure — arches de ballons, sweet tables,
          scénographie florale.
        </div>
      </div>
    ),
    size,
  );
}
