import type { Metadata } from "next"
import EasyIpSwitchLanding from "./easy-ip-switch-landing"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"
const VERSION = "1.1.1"

const TITLE = "Easy IP-Switch — Changer d'adresse IP facilement"
const DESCRIPTION =
  "L'application Tout-en-un pour changer facilement et rapidement d'adresse IP. Gratuite, portable et disponible pour Windows 8, 10, 11 et macOS (Intel et Apple Silicon)."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "changer adresse IP",
    "adresse IP fixe",
    "DHCP",
    "Easy IP-Switch",
    "utilitaire réseau",
    "Windows",
    "macOS",
    "test de ping",
    "Angeli Visions",
  ],
  alternates: {
    canonical: `${BASE_URL}/easy-ip-switch`,
  },
  openGraph: {
    type: "website",
    siteName: "Angeli Visions",
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/easy-ip-switch`,
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const faq = [
  {
    question: "L'application est-elle vraiment gratuite ?",
    answer:
      "Oui. Easy IP-Switch est gratuite, sans publicité, sans compte et sans version payante. Un don via PayPal reste possible pour soutenir le développement, mais il est entièrement facultatif.",
  },
  {
    question: "Faut-il être administrateur pour changer d'adresse IP ?",
    answer:
      "Sur Windows, oui : l'application demande l'élévation au lancement, car la modification d'une carte réseau est une opération protégée. Sur macOS, l'autorisation est demandée au moment de chaque changement, et la consultation reste possible sans privilège.",
  },
  {
    question: "Comment choisir entre macOS Intel et Apple Silicon ?",
    answer:
      "Ouvrez le menu Apple → « À propos de ce Mac ». Si la ligne « Puce » indique Apple M1, M2, M3, M4 ou plus récent, téléchargez la version Apple Silicon. Si la ligne « Processeur » mentionne Intel, prenez la version Intel.",
  },
  {
    question: "Windows affiche un avertissement SmartScreen, est-ce normal ?",
    answer:
      "Oui. L'exécutable n'est pas signé par un certificat commercial, Windows peut donc afficher « Windows a protégé votre ordinateur ». Cliquez sur « Informations complémentaires », puis sur « Exécuter quand même ».",
  },
  {
    question: "L'application collecte-t-elle des données ?",
    answer:
      "Non. Aucune télémétrie, aucun compte et aucune connexion sortante en dehors des pings que vous lancez vous-même vers une adresse de votre réseau.",
  },
  {
    question: "Mes changements sont-ils appliqués immédiatement ?",
    answer:
      "Chaque carte possède son bouton « Changer » pour appliquer sa configuration. Si vous fermez l'application avec des modifications en attente, une fenêtre vous propose de tout appliquer, de quitter sans appliquer ou de rester.",
  },
  {
    question: "Puis-je revenir à une adresse IP automatique ?",
    answer:
      "Oui. Sélectionnez « DHCP » sur la carte concernée puis validez : la carte récupère une adresse attribuée par le routeur. Sous Windows, votre dernière adresse fixe reste mémorisée et s'affiche comme référence.",
  },
]

export default function EasyIpSwitchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/easy-ip-switch#app`,
        name: "Easy IP-Switch",
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "Network configuration",
        operatingSystem: "Windows 8, Windows 10, Windows 11, macOS 12+",
        softwareVersion: VERSION,
        description: DESCRIPTION,
        url: `${BASE_URL}/easy-ip-switch`,
        downloadUrl: [
          `${BASE_URL}/downloads/easy-ip-switch/easy-ip-switch-${VERSION}-windows.exe`,
          `${BASE_URL}/downloads/easy-ip-switch/easy-ip-switch-${VERSION}-macos-intel.dmg`,
          `${BASE_URL}/downloads/easy-ip-switch/easy-ip-switch-${VERSION}-macos-apple-silicon.dmg`,
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
        publisher: {
          "@type": "Organization",
          name: "Angeli Visions",
          url: BASE_URL,
        },
        featureList: [
          "Bascule entre DHCP et adresse IP fixe",
          "Modification de l'adresse IP, du masque et de la passerelle",
          "Test de connectivité intégré",
          "Test de ping depuis la carte réseau choisie",
          "Gestion de plusieurs cartes réseau",
          "Interface claire et sombre",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/easy-ip-switch#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE_URL}/easy-ip-switch#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Angeli Visions",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Easy IP-Switch",
            item: `${BASE_URL}/easy-ip-switch`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EasyIpSwitchLanding faq={faq} />
    </>
  )
}
