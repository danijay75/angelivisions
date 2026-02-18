import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Angeli Visions — Organisateur d'événements & Maison de disque",
        short_name: "Angeli Visions",
        description:
            "Production musicale, organisation événementielle, DJ booking et expériences immersives.",
        start_url: "/fr",
        display: "standalone",
        background_color: "#020617",
        theme_color: "#7c3aed",
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
            {
                src: "/apple-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    }
}
