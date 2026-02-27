import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Angeli Visions — Organisateur d'événements & Maison de disque"
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
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f0d2e 0%, #1e1b4b 40%, #7c3aed 100%)",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: "absolute",
                        top: -80,
                        right: -80,
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "rgba(124, 58, 237, 0.3)",
                        filter: "blur(60px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -60,
                        left: -60,
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        background: "rgba(236, 72, 153, 0.2)",
                        filter: "blur(50px)",
                    }}
                />

                {/* Title */}
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 800,
                        color: "white",
                        letterSpacing: "-2px",
                        marginBottom: 16,
                        display: "flex",
                    }}
                >
                    ANGELI VISIONS
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: 120,
                        height: 4,
                        background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                        borderRadius: 2,
                        marginBottom: 24,
                    }}
                />

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: 28,
                        color: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                    }}
                >
                    Organisateur d&apos;événements & Maison de disque
                </div>

                {/* Tags */}
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 32,
                    }}
                >
                    {["🎵 Production", "🎪 Événements", "🎧 DJ", "📽️ Mapping"].map((tag) => (
                        <div
                            key={tag}
                            style={{
                                padding: "8px 20px",
                                borderRadius: 20,
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "rgba(255,255,255,0.7)",
                                fontSize: 18,
                                display: "flex",
                            }}
                        >
                            {tag}
                        </div>
                    ))}
                </div>

                {/* URL */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 30,
                        fontSize: 18,
                        color: "rgba(255,255,255,0.4)",
                        display: "flex",
                    }}
                >
                    angelivisions.com
                </div>
            </div>
        ),
        { ...size }
    )
}
