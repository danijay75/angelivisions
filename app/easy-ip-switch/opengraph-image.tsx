import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Easy IP-Switch — L'application Tout-en-un pour changer facilement d'adresse IP"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #04070f 0%, #0a1730 45%, #15346b 100%)",
          fontFamily: "sans-serif",
          padding: "60px 70px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.35)",
            filter: "blur(90px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(56, 189, 248, 0.22)",
            filter: "blur(90px)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            IP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "white", display: "flex" }}>
              Easy IP-Switch
            </div>
            <div
              style={{
                fontSize: 14,
                letterSpacing: 3,
                color: "rgba(147, 197, 253, 0.9)",
                marginTop: 4,
                display: "flex",
              }}
            >
              PAR ANGELI VISIONS
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.12,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            L’application Tout-en-un pour changer facilement et rapidement d’adresse IP
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {["Windows 8 / 10 / 11", "macOS Intel", "Apple Silicon"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(226, 232, 240, 0.85)",
                  fontSize: 18,
                  display: "flex",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "rgba(147, 197, 253, 0.9)",
              display: "flex",
            }}
          >
            angelivisions.com/easy-ip-switch
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
