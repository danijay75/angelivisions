import type { PageLocale } from "./locales"

type TitleParts = { pre: string; accent: string; post: string }

type FeatureCopy = { title: string; description: string }

type DownloadCopy = {
  title: string
  subtitle: string
  compatibility: string
  bullets: string[]
  cta: string
}

export type LandingContent = {
  lang: string
  meta: {
    title: string
    description: string
    keywords: string[]
  }
  nav: {
    features: string
    how: string
    downloads: string
    faq: string
    support: string
    download: string
    language: string
  }
  hero: {
    badge: string
    free: string
    kicker: string
    tagline: string
    title: TitleParts
    description: string
    ctaDownload: string
    ctaFeatures: string
    meta: [string, string, string]
  }
  mock: {
    aria: string
    title: string
    admin: string
    tabs: { adapters: string; ping: string }
    connected: string
    dhcp: string
    static: string
    fields: { ip: string; mask: string; gateway: string }
    test: string
    cancel: string
    apply: string
    success: string
    wifi: string
    savedStatic: string
    autoRefresh: string
    adapterActive: string
  }
  features: {
    eyebrow: string
    title: { pre: string; accent: string }
    description: string
    items: FeatureCopy[]
    highlights: FeatureCopy[]
  }
  steps: {
    eyebrow: string
    title: TitleParts
    description: string
    items: FeatureCopy[]
    noteLabel: string
    note: string
  }
  downloads: {
    eyebrow: string
    title: { pre: string; accent: string }
    description: string
    recommended: string
    windows: DownloadCopy
    macIntel: DownloadCopy
    macArm: DownloadCopy
    macNotice: string
    installWin: { title: string; steps: string[] }
    installMac: { title: string; steps: string[] }
    sizeWindows: string
    sizeMac: string
    freeLabel: string
    windowsWarning: {
      eyebrow: string
      title: string
      description: string
      steps: string[]
      hashLabel: string
      zipCta: string
      checksumsCta: string
      githubCta: string
      note: string
    }
  }
  donation: {
    eyebrow: string
    titlePre: string
    titleAccent: string
    description: string
    cta: string
    back: string
    note: string
    qrTitle: string
    qrHint: string
    qrAlt: string
  }
  faq: {
    eyebrow: string
    title: { pre: string; accent: string }
    description: string
    items: { question: string; answer: string }[]
  }
  footer: {
    tagline: string
    description: string
    appColumn: string
    siteColumn: string
    contactColumn: string
    site: string
    legal: string
    privacy: string
    donate: string
    rights: string
    disclaimer: string
  }
}

const fr: LandingContent = {
  lang: "fr",
  meta: {
    title: "Easy IP-Switch — Changer d'adresse IP facilement",
    description:
      "L'application Tout-en-un pour changer facilement et rapidement d'adresse IP. Gratuite, portable et disponible pour Windows 8, 10, 11 et macOS (Intel et Apple Silicon).",
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
  },
  nav: {
    features: "Fonctionnalités",
    how: "Comment ça marche",
    downloads: "Téléchargements",
    faq: "FAQ",
    support: "Soutenir",
    download: "Télécharger",
    language: "Changer de langue",
  },
  hero: {
    badge: "Nouveau · Version 1.1.3",
    free: "Gratuit et sans inscription",
    kicker: "Easy IP-Switch",
    tagline: "L’application Tout-en-un pour changer facilement et rapidement d’adresse IP",
    title: {
      pre: "L’application ",
      accent: "Tout-en-un",
      post: " pour changer facilement et rapidement d’adresse IP",
    },
    description:
      "Easy IP-Switch réunit le changement d’adresse, la validation des champs et le test de connexion dans une interface unique. Fini les clics dans les menus réseau de Windows ou de macOS : tout se fait en quelques secondes.",
    ctaDownload: "Télécharger gratuitement",
    ctaFeatures: "Découvrir les fonctionnalités",
    meta: ["Windows 8, 10 et 11", "macOS Intel et Apple Silicon", "Aucune installation requise"],
  },
  mock: {
    aria:
      "Aperçu de l'interface d'Easy IP-Switch : une carte Ethernet avec le choix DHCP ou adresse fixe, les champs adresse IP, masque et passerelle, le bouton de test et le bouton Changer.",
    title: "Easy IP-Switch",
    admin: "Administrateur",
    tabs: { adapters: "Cartes réseau", ping: "Test de ping" },
    connected: "Connecté",
    dhcp: "DHCP",
    static: "Adresse fixe",
    fields: { ip: "Adresse IP", mask: "Masque", gateway: "Passerelle" },
    test: "Tester",
    cancel: "Annuler",
    apply: "Changer",
    success: "Adresse et passerelle joignables (3 ms).",
    wifi: "Wi-Fi",
    savedStatic: "adresse fixe enregistrée : 192.168.1.50",
    autoRefresh: "Actualisation automatique",
    adapterActive: "Carte active",
  },
  features: {
    eyebrow: "Fonctionnalités",
    title: { pre: "Un seul outil, ", accent: "tout votre réseau" },
    description:
      "Conçu pour aller vite : chaque action essentielle tient sur un écran, sans plonger dans les paramètres de Windows ou de macOS.",
    items: [
      {
        title: "DHCP ou adresse fixe",
        description:
          "Basculez d’une attribution automatique à une adresse fixe — et inversement — d’un clic, sans redémarrer ni passer par les menus système.",
      },
      {
        title: "Adresse, masque, passerelle",
        description:
          "Les trois valeurs essentielles dans un seul formulaire, avec validation immédiate du format, du masque contigu et du sous-réseau.",
      },
      {
        title: "Test de connectivité",
        description:
          "Vérifiez que l’adresse de la carte et sa passerelle répondent réellement, avec le temps de réponse en millisecondes.",
      },
      {
        title: "Toutes vos cartes réseau",
        description:
          "Ethernet, Wi-Fi et interfaces virtuelles réunies sur un même écran, avec leur état, leur adresse actuelle et les changements en attente.",
      },
      {
        title: "Onglet Test de ping",
        description:
          "Pingez n’importe quelle cible depuis la carte réseau de votre choix, sans ouvrir de terminal ni mémoriser de commande.",
      },
      {
        title: "Léger, portable et multilingue",
        description:
          "Un seul exécutable de moins de 300 Ko, aucune installation, aucune télémétrie. Interface en français, anglais, allemand et espagnol, thème clair et sombre au choix.",
      },
    ],
    highlights: [
      {
        title: "Conditions et RGPD en un clic",
        description:
          "Les conditions d’utilisation et la notice RGPD s’acceptent en un clic au premier lancement, puis restent mémorisées.",
      },
      {
        title: "Détection des droits",
        description: "L’application indique si elle dispose bien des droits administrateur.",
      },
      {
        title: "Connexions réseau",
        description: "Ouvre le panneau Windows et crée un raccourci sur le Bureau.",
      },
      {
        title: "Adresse fixe mémorisée",
        description: "Windows conserve votre dernière adresse fixe même sous DHCP.",
      },
      {
        title: "Activation des cartes",
        description: "Activez ou désactivez une interface sans quitter l’application.",
      },
    ],
  },
  steps: {
    eyebrow: "En trois étapes",
    title: {
      pre: "De l’ouverture à la nouvelle adresse, ",
      accent: "en quelques secondes",
      post: "",
    },
    description:
      "Aucun script, aucun terminal, aucun redémarrage : une interface claire qui montre toujours l’état réel de vos cartes.",
    items: [
      {
        title: "Lancez l’application",
        description:
          "Sur Windows, acceptez la demande d’élévation. Sur macOS, l’application s’ouvre immédiatement ; l’autorisation sera demandée au moment du changement.",
      },
      {
        title: "Choisissez la carte",
        description:
          "Sélectionnez Ethernet, Wi-Fi ou toute autre interface. Son état et son adresse IPv4 actuelle s’affichent automatiquement.",
      },
      {
        title: "Changez et testez",
        description:
          "Passez en DHCP ou saisissez une adresse fixe, cliquez sur « Changer », puis sur « Tester » pour vérifier la connexion.",
      },
    ],
    noteLabel: "Bon à savoir :",
    note:
      "les modifications non appliquées sont proposées à la fermeture. Vous pouvez tout appliquer d’un coup, quitter sans rien changer ou rester dans l’application.",
  },
  downloads: {
    eyebrow: "Téléchargements",
    title: { pre: "Choisissez ", accent: "votre version" },
    description:
      "Version 1.1.3 · Gratuit · Windows 8, 10 et 11 · macOS 12 ou plus récent. Le même contenu, sur tous vos appareils.",
    recommended: "Recommandé pour votre appareil",
    windows: {
      title: "Windows",
      subtitle: "PC et tablettes",
      compatibility: "Windows 8, 10 et 11",
      bullets: [
        "Windows 8, 10 et 11",
        "Aucune installation, exécutable portable",
        "Droits administrateur requis",
      ],
      cta: "Télécharger pour Windows",
    },
    macIntel: {
      title: "macOS Intel",
      subtitle: "Mac à processeur Intel",
      compatibility: "macOS 12 (Monterey) ou plus récent",
      bullets: [
        "Mac avec processeur Intel",
        "macOS 12 ou plus récent",
        "Installation par glisser-déposer",
      ],
      cta: "Télécharger pour Intel",
    },
    macArm: {
      title: "macOS Apple Silicon",
      subtitle: "Mac avec puce Apple",
      compatibility: "macOS 12 ou plus récent",
      bullets: [
        "Mac avec puce M1, M2, M3 ou M4",
        "macOS 12 ou plus récent",
        "Installation par glisser-déposer",
      ],
      cta: "Télécharger pour Apple Silicon",
    },
    macNotice:
      "Vous êtes sur Mac. Ouvrez le menu Apple → « À propos de ce Mac » : si la ligne « Puce » indique Apple M1, M2, M3, M4 ou plus récent, choisissez Apple Silicon. Si la ligne « Processeur » mentionne Intel, choisissez la version Intel.",
    installWin: {
      title: "Installer sur Windows",
      steps: [
        "Téléchargez le ZIP, puis extrayez l’exécutable.",
        "Si SmartScreen s’affiche : « Informations complémentaires », puis « Exécuter quand même ».",
        "Acceptez la demande d’élévation : elle est nécessaire pour modifier une carte réseau.",
        "Aucune installation : le fichier peut rester sur le Bureau, dans un dossier ou sur une clé USB.",
      ],
    },
    installMac: {
      title: "Installer sur macOS",
      steps: [
        "Téléchargez le .dmg correspondant à votre puce.",
        "Ouvrez le DMG, puis glissez Easy IP-Switch dans le dossier Applications.",
        "Au premier lancement, si macOS bloque l’application : clic droit sur l’icône → « Ouvrir ».",
        "Au premier lancement, acceptez les conditions d’utilisation et la notice RGPD.",
        "macOS 15 et plus récent : autorisez l’accès au réseau local pour le test de ping.",
      ],
    },
    sizeWindows: "118 Ko",
    sizeMac: "1,2 Mo",
    freeLabel: "gratuit",
    windowsWarning: {
      eyebrow: "Windows · SmartScreen",
      title: "Windows affiche un avertissement ?",
      description:
        "L’exécutable Windows n’est pas encore signé avec un certificat commercial. Windows peut donc afficher « Windows a protégé votre PC » ou « Éditeur inconnu ». Ce n’est pas un virus : le fichier est compilé par Angeli Visions et contrôlé avant publication. Une signature de code commerciale est à l’étude.",
      steps: [
        "Téléchargez le fichier depuis cette page ou depuis GitHub Releases.",
        "Vérifiez l’empreinte SHA-256 ci-dessous (la commande PowerShell est dans le README).",
        "Si SmartScreen apparaît : cliquez sur « Informations complémentaires », puis « Exécuter quand même ».",
        "Acceptez la demande d’élévation (UAC) : elle est nécessaire pour modifier une carte réseau.",
      ],
      hashLabel: "Empreinte SHA-256 de l’exécutable",
      zipCta: "Télécharger le ZIP + README",
      checksumsCta: "Voir les empreintes",
      githubCta: "GitHub Releases",
      note:
        "Ne lancez jamais une copie provenant d’un autre site sans vérifier son empreinte. Le ZIP contient l’exécutable, le README, la licence et les empreintes.",
    },
  },
  donation: {
    eyebrow: "Soutenir le projet",
    titlePre: "Soutenir ",
    titleAccent: "Easy IP-Switch",
    description:
      "L’application est développée bénévolement et distribuée gratuitement, sans publicité ni version payante. Un don aide à couvrir les frais de développement, de signature et d’hébergement — et à financer les prochaines versions.",
    cta: "Faire un don via PayPal",
    back: "Retour aux téléchargements",
    note: "Paiement sécurisé par PayPal · Carte bancaire acceptée · Don ponctuel ou récurrent",
    qrTitle: "Scannez avec votre téléphone",
    qrHint: "ou cliquez pour ouvrir la page PayPal",
    qrAlt: "QR code pour faire un don PayPal à Easy IP-Switch",
  },
  faq: {
    eyebrow: "FAQ",
    title: { pre: "Les questions ", accent: "les plus fréquentes" },
    description: "Une autre question ? Écrivez-nous à contact@angelivisions.com.",
    items: [
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
          "Oui. L'exécutable n'est pas encore signé avec un certificat commercial, Windows peut donc afficher « Windows a protégé votre ordinateur ». Vérifiez l'empreinte SHA-256 dans la section Téléchargements, puis cliquez sur « Informations complémentaires » et « Exécuter quand même ». Une signature de code commerciale est à l’étude.",
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
    ],
  },
  footer: {
    tagline: "Un outil Angeli Visions · v1.1.3",
    description:
      "L’application Tout-en-un pour changer facilement et rapidement d’adresse IP, sous Windows 8, 10, 11 et macOS.",
    appColumn: "Application",
    siteColumn: "Angeli Visions",
    contactColumn: "Contact & don",
    site: "Le site",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    donate: "Faire un don",
    rights: "Tous droits réservés.",
    disclaimer: "Easy IP-Switch est distribué gratuitement, sans garantie d’aucune sorte.",
  },
}

const en: LandingContent = {
  lang: "en",
  meta: {
    title: "Easy IP-Switch — Change your IP address easily",
    description:
      "The all-in-one app to change your IP address quickly and easily. Free, portable and available for Windows 8, 10, 11 and macOS (Intel and Apple Silicon).",
    keywords: [
      "change IP address",
      "static IP",
      "DHCP",
      "Easy IP-Switch",
      "network utility",
      "Windows",
      "macOS",
      "ping test",
      "Angeli Visions",
    ],
  },
  nav: {
    features: "Features",
    how: "How it works",
    downloads: "Downloads",
    faq: "FAQ",
    support: "Support us",
    download: "Download",
    language: "Change language",
  },
  hero: {
    badge: "New · Version 1.1.3",
    free: "Free, no sign-up",
    kicker: "Easy IP-Switch",
    tagline: "The all-in-one app to change your IP address quickly and easily",
    title: { pre: "The ", accent: "all-in-one", post: " app to change your IP address quickly and easily" },
    description:
      "Easy IP-Switch brings address changes, field validation and connection testing together in one interface. No more digging through the network menus in Windows or macOS: everything takes a few seconds.",
    ctaDownload: "Download for free",
    ctaFeatures: "Explore the features",
    meta: ["Windows 8, 10 and 11", "macOS Intel and Apple Silicon", "No installation required"],
  },
  mock: {
    aria:
      "Preview of the Easy IP-Switch interface: an Ethernet adapter with DHCP or static address, the IP address, mask and gateway fields, and the test and apply buttons.",
    title: "Easy IP-Switch",
    admin: "Administrator",
    tabs: { adapters: "Network adapters", ping: "Ping test" },
    connected: "Connected",
    dhcp: "DHCP",
    static: "Static IP",
    fields: { ip: "IP address", mask: "Subnet mask", gateway: "Gateway" },
    test: "Test",
    cancel: "Cancel",
    apply: "Apply",
    success: "Address and gateway reachable (3 ms).",
    wifi: "Wi-Fi",
    savedStatic: "saved static address: 192.168.1.50",
    autoRefresh: "Automatic refresh",
    adapterActive: "Adapter enabled",
  },
  features: {
    eyebrow: "Features",
    title: { pre: "One tool, ", accent: "your whole network" },
    description:
      "Built for speed: every essential action fits on one screen, without digging into Windows or macOS settings.",
    items: [
      {
        title: "DHCP or static IP",
        description:
          "Switch from automatic assignment to a static address — and back — in one click, without rebooting or going through system menus.",
      },
      {
        title: "Address, mask, gateway",
        description:
          "The three essential values in one form, with instant validation of the format, contiguous mask and subnet.",
      },
      {
        title: "Connectivity test",
        description:
          "Check that the adapter's address and its gateway actually respond, with the response time in milliseconds.",
      },
      {
        title: "All your network adapters",
        description:
          "Ethernet, Wi-Fi and virtual interfaces on a single screen, with their status, current address and pending changes.",
      },
      {
        title: "Dedicated ping tab",
        description:
          "Ping any target from the network adapter of your choice, without opening a terminal or memorising commands.",
      },
      {
        title: "Lightweight, portable and multilingual",
        description:
          "A single executable under 300 KB, no installation, no telemetry. Interface in French, English, German and Spanish, with light and dark themes.",
      },
    ],
    highlights: [
      {
        title: "Terms and GDPR in one click",
        description:
          "The terms of use and GDPR notice are accepted in one click at first launch, then remembered.",
      },
      {
        title: "Permission detection",
        description: "The app shows whether it really has administrator rights.",
      },
      {
        title: "Network connections",
        description: "Opens the Windows panel and creates a desktop shortcut.",
      },
      {
        title: "Remembered static IP",
        description: "Windows keeps your last static address even while on DHCP.",
      },
      {
        title: "Adapter on/off",
        description: "Enable or disable an interface without leaving the app.",
      },
    ],
  },
  steps: {
    eyebrow: "Three steps",
    title: { pre: "From launch to a new address, ", accent: "in seconds", post: "" },
    description:
      "No scripts, no terminal, no reboot: a clear interface that always shows the real state of your adapters.",
    items: [
      {
        title: "Launch the app",
        description:
          "On Windows, accept the elevation prompt. On macOS, the app opens immediately; authorisation is requested when you apply a change.",
      },
      {
        title: "Choose the adapter",
        description:
          "Select Ethernet, Wi-Fi or any other interface. Its status and current IPv4 address appear automatically.",
      },
      {
        title: "Change and test",
        description:
          "Switch to DHCP or enter a static address, click “Apply”, then “Test” to check the connection.",
      },
    ],
    noteLabel: "Good to know:",
    note:
      "unapplied changes are offered when you close the app. You can apply everything at once, quit without changing anything, or stay in the app.",
  },
  downloads: {
    eyebrow: "Downloads",
    title: { pre: "Choose ", accent: "your version" },
    description:
      "Version 1.1.3 · Free · Windows 8, 10 and 11 · macOS 12 or later. The same app, on all your devices.",
    recommended: "Recommended for your device",
    windows: {
      title: "Windows",
      subtitle: "PCs and tablets",
      compatibility: "Windows 8, 10 and 11",
      bullets: [
        "Windows 8, 10 and 11",
        "No installation, portable executable",
        "Administrator rights required",
      ],
      cta: "Download for Windows",
    },
    macIntel: {
      title: "macOS Intel",
      subtitle: "Intel-based Mac",
      compatibility: "macOS 12 (Monterey) or later",
      bullets: ["Intel-based Mac", "macOS 12 or later", "Drag-and-drop installation"],
      cta: "Download for Intel",
    },
    macArm: {
      title: "macOS Apple Silicon",
      subtitle: "Mac with Apple silicon",
      compatibility: "macOS 12 or later",
      bullets: ["Mac with M1, M2, M3 or M4 chip", "macOS 12 or later", "Drag-and-drop installation"],
      cta: "Download for Apple Silicon",
    },
    macNotice:
      "You're on a Mac. Open the Apple menu → “About This Mac”: if the “Chip” line says Apple M1, M2, M3, M4 or later, choose Apple Silicon. If the “Processor” line mentions Intel, choose the Intel version.",
    installWin: {
      title: "Install on Windows",
      steps: [
        "Download the ZIP, then extract the executable.",
        "If SmartScreen appears: “More info”, then “Run anyway”.",
        "Accept the elevation prompt: it is required to change a network adapter.",
        "No installation: the file can stay on your Desktop, in a folder or on a USB stick.",
      ],
    },
    installMac: {
      title: "Install on macOS",
      steps: [
        "Download the .dmg that matches your chip.",
        "Open the DMG, then drag Easy IP-Switch into the Applications folder.",
        "On first launch, if macOS blocks the app: right-click the icon → “Open”.",
        "At first launch, accept the terms of use and the GDPR notice.",
        "macOS 15 or later: allow local network access for the ping test.",
      ],
    },
    sizeWindows: "118 KB",
    sizeMac: "1.2 MB",
    freeLabel: "free",
    windowsWarning: {
      eyebrow: "Windows · SmartScreen",
      title: "Windows shows a warning?",
      description:
        "The Windows executable is not yet signed with a commercial certificate. Windows may therefore show “Windows protected your PC” or “Unknown publisher”. It is not a virus: the file is built by Angeli Visions and checked before release. Commercial code signing is under consideration.",
      steps: [
        "Download the file from this page or from GitHub Releases.",
        "Verify the SHA-256 hash below (the PowerShell command is in the README).",
        "If SmartScreen appears: click “More info”, then “Run anyway”.",
        "Accept the elevation prompt (UAC): it is required to change a network adapter.",
      ],
      hashLabel: "SHA-256 hash of the executable",
      zipCta: "Download ZIP + README",
      checksumsCta: "View checksums",
      githubCta: "GitHub Releases",
      note:
        "Never run a copy from another site without verifying its hash. The ZIP contains the executable, README, license and checksums.",
    },
  },
  donation: {
    eyebrow: "Support the project",
    titlePre: "Support ",
    titleAccent: "Easy IP-Switch",
    description:
      "This app is developed on a volunteer basis and distributed for free, with no ads and no paid version. A donation helps cover development, signing and hosting costs — and funds future versions.",
    cta: "Donate via PayPal",
    back: "Back to downloads",
    note: "Secure payment via PayPal · Credit cards accepted · One-time or recurring donation",
    qrTitle: "Scan with your phone",
    qrHint: "or click to open the PayPal page",
    qrAlt: "QR code to donate to Easy IP-Switch via PayPal",
  },
  faq: {
    eyebrow: "FAQ",
    title: { pre: "Frequently asked ", accent: "questions" },
    description: "Another question? Write to contact@angelivisions.com.",
    items: [
      {
        question: "Is the app really free?",
        answer:
          "Yes. Easy IP-Switch is free, with no ads, no account and no paid version. A donation via PayPal is possible to support development, but it is entirely optional.",
      },
      {
        question: "Do I need administrator rights to change an IP address?",
        answer:
          "On Windows, yes: the app requests elevation at launch, because changing a network adapter is a protected operation. On macOS, authorisation is requested each time you apply a change, and you can still browse the app without privileges.",
      },
      {
        question: "How do I choose between macOS Intel and Apple Silicon?",
        answer:
          "Open the Apple menu → “About This Mac”. If the “Chip” line shows Apple M1, M2, M3, M4 or later, download the Apple Silicon version. If the “Processor” line mentions Intel, choose the Intel version.",
      },
      {
        question: "Windows shows a SmartScreen warning — is that normal?",
        answer:
          "Yes. The executable is not yet signed with a commercial certificate, so Windows may display “Windows protected your PC”. Verify the SHA-256 hash in the Downloads section, then click “More info” and “Run anyway”. Commercial code signing is under consideration.",
      },
      {
        question: "Does the app collect any data?",
        answer:
          "No. No telemetry, no account and no outbound connection other than the pings you run yourself to an address on your network.",
      },
      {
        question: "Are my changes applied immediately?",
        answer:
          "Each adapter has its own “Apply” button. If you close the app with pending changes, a window offers to apply them all, quit without applying, or stay.",
      },
      {
        question: "Can I go back to an automatic IP address?",
        answer:
          "Yes. Select “DHCP” on the adapter and confirm: it receives an address from the router. On Windows, your last static address stays remembered and is shown for reference.",
      },
    ],
  },
  footer: {
    tagline: "An Angeli Visions tool · v1.1.3",
    description:
      "The all-in-one app to change your IP address quickly and easily, on Windows 8, 10, 11 and macOS.",
    appColumn: "Application",
    siteColumn: "Angeli Visions",
    contactColumn: "Contact & donate",
    site: "The website",
    legal: "Legal notice",
    privacy: "Privacy",
    donate: "Donate",
    rights: "All rights reserved.",
    disclaimer: "Easy IP-Switch is distributed free of charge, without warranty of any kind.",
  },
}

const de: LandingContent = {
  lang: "de",
  meta: {
    title: "Easy IP-Switch — IP-Adresse einfach ändern",
    description:
      "Die All-in-One-App, um Ihre IP-Adresse schnell und einfach zu ändern. Kostenlos, portabel und verfügbar für Windows 8, 10, 11 und macOS (Intel und Apple Silicon).",
    keywords: [
      "IP-Adresse ändern",
      "feste IP",
      "DHCP",
      "Easy IP-Switch",
      "Netzwerk-Tool",
      "Windows",
      "macOS",
      "Ping-Test",
      "Angeli Visions",
    ],
  },
  nav: {
    features: "Funktionen",
    how: "So funktioniert’s",
    downloads: "Downloads",
    faq: "FAQ",
    support: "Unterstützen",
    download: "Herunterladen",
    language: "Sprache ändern",
  },
  hero: {
    badge: "Neu · Version 1.1.3",
    free: "Kostenlos, ohne Anmeldung",
    kicker: "Easy IP-Switch",
    tagline: "Die All-in-One-App, um Ihre IP-Adresse schnell und einfach zu ändern",
    title: {
      pre: "Die ",
      accent: "All-in-One-App",
      post: ", um Ihre IP-Adresse schnell und einfach zu ändern",
    },
    description:
      "Easy IP-Switch vereint Adresswechsel, Feldprüfung und Verbindungstest in einer Oberfläche. Schluss mit dem Klicken durch die Netzwerkmenüs von Windows oder macOS: alles dauert nur wenige Sekunden.",
    ctaDownload: "Kostenlos herunterladen",
    ctaFeatures: "Funktionen entdecken",
    meta: ["Windows 8, 10 und 11", "macOS Intel und Apple Silicon", "Keine Installation nötig"],
  },
  mock: {
    aria:
      "Vorschau der Easy-IP-Switch-Oberfläche: ein Ethernet-Adapter mit DHCP oder fester Adresse, den Feldern IP-Adresse, Subnetzmaske und Gateway sowie den Schaltflächen Testen und Ändern.",
    title: "Easy IP-Switch",
    admin: "Administrator",
    tabs: { adapters: "Netzwerkadapter", ping: "Ping-Test" },
    connected: "Verbunden",
    dhcp: "DHCP",
    static: "Feste Adresse",
    fields: { ip: "IP-Adresse", mask: "Subnetzmaske", gateway: "Gateway" },
    test: "Testen",
    cancel: "Abbrechen",
    apply: "Ändern",
    success: "Adresse und Gateway erreichbar (3 ms).",
    wifi: "WLAN",
    savedStatic: "gespeicherte feste Adresse: 192.168.1.50",
    autoRefresh: "Automatische Aktualisierung",
    adapterActive: "Adapter aktiv",
  },
  features: {
    eyebrow: "Funktionen",
    title: { pre: "Ein Tool, ", accent: "Ihr ganzes Netzwerk" },
    description:
      "Auf Tempo ausgelegt: Jede wichtige Aktion passt auf einen Bildschirm, ohne in den Windows- oder macOS-Einstellungen zu wühlen.",
    items: [
      {
        title: "DHCP oder feste IP",
        description:
          "Wechseln Sie mit einem Klick von der automatischen Zuweisung zu einer festen Adresse – und zurück –, ohne Neustart und ohne Systemmenüs.",
      },
      {
        title: "Adresse, Maske, Gateway",
        description:
          "Die drei entscheidenden Werte in einem Formular, mit sofortiger Prüfung von Format, zusammenhängender Maske und Subnetz.",
      },
      {
        title: "Konnektivitätstest",
        description:
          "Prüfen Sie, ob die Adresse des Adapters und sein Gateway tatsächlich antworten – inklusive Antwortzeit in Millisekunden.",
      },
      {
        title: "Alle Ihre Netzwerkadapter",
        description:
          "Ethernet, WLAN und virtuelle Schnittstellen auf einem Bildschirm, mit Status, aktueller Adresse und ausstehenden Änderungen.",
      },
      {
        title: "Eigener Ping-Tab",
        description:
          "Pingen Sie ein beliebiges Ziel über den Netzwerkadapter Ihrer Wahl – ohne Terminal und ohne Befehle auswendig zu lernen.",
      },
      {
        title: "Leicht, portabel und mehrsprachig",
        description:
          "Eine einzige ausführbare Datei unter 300 KB, keine Installation, keine Telemetrie. Oberfläche auf Französisch, Englisch, Deutsch und Spanisch, helles und dunkles Design inklusive.",
      },
    ],
    highlights: [
      {
        title: "Bedingungen und DSGVO mit einem Klick",
        description:
          "Die Nutzungsbedingungen und der DSGVO-Hinweis werden beim ersten Start mit einem Klick akzeptiert und anschließend gespeichert.",
      },
      {
        title: "Rechte-Erkennung",
        description: "Die App zeigt an, ob sie tatsächlich über Administratorrechte verfügt.",
      },
      {
        title: "Netzwerkverbindungen",
        description: "Öffnet das Windows-Fenster und legt eine Desktop-Verknüpfung an.",
      },
      {
        title: "Gespeicherte feste IP",
        description: "Windows behält Ihre letzte feste Adresse auch unter DHCP.",
      },
      {
        title: "Adapter aktivieren",
        description: "Aktivieren oder deaktivieren Sie eine Schnittstelle, ohne die App zu verlassen.",
      },
    ],
  },
  steps: {
    eyebrow: "In drei Schritten",
    title: {
      pre: "Vom Start zur neuen Adresse – ",
      accent: "in wenigen Sekunden",
      post: "",
    },
    description:
      "Keine Skripte, kein Terminal, kein Neustart: eine klare Oberfläche, die immer den echten Zustand Ihrer Adapter zeigt.",
    items: [
      {
        title: "App starten",
        description:
          "Unter Windows bestätigen Sie die Administratorabfrage. Unter macOS öffnet sich die App sofort; die Freigabe wird beim Ändern abgefragt.",
      },
      {
        title: "Adapter auswählen",
        description:
          "Wählen Sie Ethernet, WLAN oder eine andere Schnittstelle. Status und aktuelle IPv4-Adresse werden automatisch angezeigt.",
      },
      {
        title: "Ändern und testen",
        description:
          "Wechseln Sie zu DHCP oder geben Sie eine feste Adresse ein, klicken Sie auf „Ändern“ und dann auf „Testen“, um die Verbindung zu prüfen.",
      },
    ],
    noteLabel: "Gut zu wissen:",
    note:
      "nicht angewendete Änderungen werden beim Schließen angeboten. Sie können alles auf einmal anwenden, ohne Änderungen beenden oder in der App bleiben.",
  },
  downloads: {
    eyebrow: "Downloads",
    title: { pre: "Wählen Sie ", accent: "Ihre Version" },
    description:
      "Version 1.1.3 · Kostenlos · Windows 8, 10 und 11 · macOS 12 oder neuer. Dieselbe App auf allen Ihren Geräten.",
    recommended: "Für Ihr Gerät empfohlen",
    windows: {
      title: "Windows",
      subtitle: "PCs und Tablets",
      compatibility: "Windows 8, 10 und 11",
      bullets: [
        "Windows 8, 10 und 11",
        "Keine Installation, portable ausführbare Datei",
        "Administratorrechte erforderlich",
      ],
      cta: "Für Windows herunterladen",
    },
    macIntel: {
      title: "macOS Intel",
      subtitle: "Mac mit Intel-Prozessor",
      compatibility: "macOS 12 (Monterey) oder neuer",
      bullets: [
        "Mac mit Intel-Prozessor",
        "macOS 12 oder neuer",
        "Installation per Drag & Drop",
      ],
      cta: "Für Intel herunterladen",
    },
    macArm: {
      title: "macOS Apple Silicon",
      subtitle: "Mac mit Apple-Chip",
      compatibility: "macOS 12 oder neuer",
      bullets: [
        "Mac mit M1-, M2-, M3- oder M4-Chip",
        "macOS 12 oder neuer",
        "Installation per Drag & Drop",
      ],
      cta: "Für Apple Silicon herunterladen",
    },
    macNotice:
      "Sie sind auf einem Mac. Öffnen Sie das Apple-Menü → „Über diesen Mac“: Steht bei „Chip“ Apple M1, M2, M3, M4 oder neuer, wählen Sie Apple Silicon. Steht bei „Prozessor“ Intel, wählen Sie die Intel-Version.",
    installWin: {
      title: "Unter Windows installieren",
      steps: [
        "Laden Sie das ZIP herunter und entpacken Sie die ausführbare Datei.",
        "Wenn SmartScreen erscheint: „Weitere Informationen“, dann „Trotzdem ausführen“.",
        "Bestätigen Sie die Administratorabfrage: Sie ist nötig, um einen Netzwerkadapter zu ändern.",
        "Keine Installation: Die Datei kann auf dem Desktop, in einem Ordner oder auf einem USB-Stick bleiben.",
      ],
    },
    installMac: {
      title: "Unter macOS installieren",
      steps: [
        "Laden Sie die zu Ihrem Chip passende .dmg-Datei herunter.",
        "Öffnen Sie das DMG und ziehen Sie Easy IP-Switch in den Ordner „Programme“.",
        "Beim ersten Start, falls macOS die App blockiert: Rechtsklick auf das Symbol → „Öffnen“.",
        "Akzeptieren Sie beim ersten Start die Nutzungsbedingungen und den DSGVO-Hinweis.",
        "macOS 15 oder neuer: Erlauben Sie den Zugriff auf das lokale Netzwerk für den Ping-Test.",
      ],
    },
    sizeWindows: "118 KB",
    sizeMac: "1,2 MB",
    freeLabel: "kostenlos",
    windowsWarning: {
      eyebrow: "Windows · SmartScreen",
      title: "Windows zeigt eine Warnung?",
      description:
        "Die Windows-Datei ist noch nicht mit einem kommerziellen Zertifikat signiert. Windows kann daher „Windows hat Ihren PC geschützt“ oder „Unbekannter Herausgeber“ anzeigen. Es ist kein Virus: Die Datei wird von Angeli Visions erstellt und vor der Veröffentlichung geprüft. Eine kommerzielle Codesignatur wird geprüft.",
      steps: [
        "Laden Sie die Datei von dieser Seite oder von GitHub Releases herunter.",
        "Prüfen Sie den SHA-256-Hash unten (der PowerShell-Befehl steht in der README).",
        "Wenn SmartScreen erscheint: „Weitere Informationen“ und dann „Trotzdem ausführen“ anklicken.",
        "Bestätigen Sie die Administratorabfrage (UAC): Sie ist nötig, um einen Netzwerkadapter zu ändern.",
      ],
      hashLabel: "SHA-256-Hash der ausführbaren Datei",
      zipCta: "ZIP + README herunterladen",
      checksumsCta: "Prüfsummen anzeigen",
      githubCta: "GitHub Releases",
      note:
        "Führen Sie niemals eine Kopie von einer anderen Website aus, ohne den Hash zu prüfen. Das ZIP enthält die ausführbare Datei, README, Lizenz und Prüfsummen.",
    },
  },
  donation: {
    eyebrow: "Projekt unterstützen",
    titlePre: "Unterstützen Sie ",
    titleAccent: "Easy IP-Switch",
    description:
      "Die App wird ehrenamtlich entwickelt und kostenlos verteilt – ohne Werbung und ohne Bezahlversion. Eine Spende hilft, Entwicklungs-, Signatur- und Hostingkosten zu decken – und künftige Versionen zu finanzieren.",
    cta: "Über PayPal spenden",
    back: "Zurück zu den Downloads",
    note: "Sichere Zahlung über PayPal · Kreditkarte möglich · Einmalige oder wiederkehrende Spende",
    qrTitle: "Mit dem Smartphone scannen",
    qrHint: "oder klicken, um die PayPal-Seite zu öffnen",
    qrAlt: "QR-Code für eine PayPal-Spende an Easy IP-Switch",
  },
  faq: {
    eyebrow: "FAQ",
    title: { pre: "Häufig gestellte ", accent: "Fragen" },
    description: "Noch eine Frage? Schreiben Sie an contact@angelivisions.com.",
    items: [
      {
        question: "Ist die App wirklich kostenlos?",
        answer:
          "Ja. Easy IP-Switch ist kostenlos, ohne Werbung, ohne Konto und ohne Bezahlversion. Eine Spende über PayPal zur Unterstützung der Entwicklung ist möglich, aber völlig freiwillig.",
      },
      {
        question: "Brauche ich Administratorrechte, um die IP-Adresse zu ändern?",
        answer:
          "Unter Windows ja: Die App fordert beim Start Administratorrechte an, da das Ändern eines Netzwerkadapters eine geschützte Operation ist. Unter macOS wird die Freigabe bei jeder Änderung abgefragt; die App lässt sich auch ohne Rechte ansehen.",
      },
      {
        question: "Wie wähle ich zwischen macOS Intel und Apple Silicon?",
        answer:
          "Öffnen Sie das Apple-Menü → „Über diesen Mac“. Steht bei „Chip“ Apple M1, M2, M3, M4 oder neuer, laden Sie die Apple-Silicon-Version. Steht bei „Prozessor“ Intel, wählen Sie die Intel-Version.",
      },
      {
        question: "Windows zeigt eine SmartScreen-Warnung – ist das normal?",
        answer:
          "Ja. Die ausführbare Datei ist noch nicht mit einem kommerziellen Zertifikat signiert, daher kann Windows „Windows hat Ihren PC geschützt“ anzeigen. Prüfen Sie den SHA-256-Hash im Bereich Downloads und klicken Sie dann auf „Weitere Informationen“ und „Trotzdem ausführen“. Eine kommerzielle Codesignatur wird geprüft.",
      },
      {
        question: "Sammelt die App Daten?",
        answer:
          "Nein. Keine Telemetrie, kein Konto und keine ausgehende Verbindung außer den Pings, die Sie selbst an eine Adresse in Ihrem Netzwerk senden.",
      },
      {
        question: "Werden meine Änderungen sofort angewendet?",
        answer:
          "Jeder Adapter hat seine eigene Schaltfläche „Ändern“. Wenn Sie die App mit ausstehenden Änderungen schließen, können Sie alles anwenden, ohne Anwendung beenden oder in der App bleiben.",
      },
      {
        question: "Kann ich zu einer automatischen IP-Adresse zurückkehren?",
        answer:
          "Ja. Wählen Sie beim Adapter „DHCP“ und bestätigen Sie: Er erhält eine Adresse vom Router. Unter Windows bleibt Ihre letzte feste Adresse gespeichert und wird als Referenz angezeigt.",
      },
    ],
  },
  footer: {
    tagline: "Ein Tool von Angeli Visions · v1.1.3",
    description:
      "Die All-in-One-App für schnelle und einfache IP-Adresswechsel unter Windows 8, 10, 11 und macOS.",
    appColumn: "App",
    siteColumn: "Angeli Visions",
    contactColumn: "Kontakt & Spende",
    site: "Die Website",
    legal: "Impressum",
    privacy: "Datenschutz",
    donate: "Spenden",
    rights: "Alle Rechte vorbehalten.",
    disclaimer: "Easy IP-Switch wird kostenlos und ohne jegliche Gewährleistung verteilt.",
  },
}

const es: LandingContent = {
  lang: "es",
  meta: {
    title: "Easy IP-Switch — Cambiar de dirección IP fácilmente",
    description:
      "La aplicación todo en uno para cambiar fácil y rápidamente de dirección IP. Gratis, portátil y disponible para Windows 8, 10, 11 y macOS (Intel y Apple Silicon).",
    keywords: [
      "cambiar dirección IP",
      "IP fija",
      "DHCP",
      "Easy IP-Switch",
      "utilidad de red",
      "Windows",
      "macOS",
      "prueba de ping",
      "Angeli Visions",
    ],
  },
  nav: {
    features: "Funciones",
    how: "Cómo funciona",
    downloads: "Descargas",
    faq: "FAQ",
    support: "Apoyar",
    download: "Descargar",
    language: "Cambiar idioma",
  },
  hero: {
    badge: "Nuevo · Versión 1.1.3",
    free: "Gratis, sin registro",
    kicker: "Easy IP-Switch",
    tagline: "La aplicación todo en uno para cambiar fácil y rápidamente de dirección IP",
    title: {
      pre: "La aplicación ",
      accent: "todo en uno",
      post: " para cambiar fácil y rápidamente de dirección IP",
    },
    description:
      "Easy IP-Switch reúne el cambio de dirección, la validación de los campos y la prueba de conexión en una sola interfaz. Se acabó buscar en los menús de red de Windows o macOS: todo se hace en unos segundos.",
    ctaDownload: "Descargar gratis",
    ctaFeatures: "Descubrir las funciones",
    meta: ["Windows 8, 10 y 11", "macOS Intel y Apple Silicon", "Sin instalación"],
  },
  mock: {
    aria:
      "Vista previa de la interfaz de Easy IP-Switch: un adaptador Ethernet con DHCP o dirección fija, los campos de dirección IP, máscara y puerta de enlace, y los botones Probar y Cambiar.",
    title: "Easy IP-Switch",
    admin: "Administrador",
    tabs: { adapters: "Adaptadores de red", ping: "Prueba de ping" },
    connected: "Conectado",
    dhcp: "DHCP",
    static: "Dirección fija",
    fields: { ip: "Dirección IP", mask: "Máscara", gateway: "Puerta de enlace" },
    test: "Probar",
    cancel: "Cancelar",
    apply: "Cambiar",
    success: "Dirección y puerta de enlace accesibles (3 ms).",
    wifi: "Wi-Fi",
    savedStatic: "dirección fija guardada: 192.168.1.50",
    autoRefresh: "Actualización automática",
    adapterActive: "Adaptador activo",
  },
  features: {
    eyebrow: "Funciones",
    title: { pre: "Una sola herramienta, ", accent: "toda tu red" },
    description:
      "Pensada para ir rápido: cada acción esencial cabe en una pantalla, sin bucear en los ajustes de Windows o macOS.",
    items: [
      {
        title: "DHCP o dirección fija",
        description:
          "Pasa de la asignación automática a una dirección fija —y viceversa— con un clic, sin reiniciar ni recorrer los menús del sistema.",
      },
      {
        title: "Dirección, máscara, puerta de enlace",
        description:
          "Los tres valores esenciales en un solo formulario, con validación inmediata del formato, la máscara contigua y la subred.",
      },
      {
        title: "Prueba de conectividad",
        description:
          "Comprueba que la dirección del adaptador y su puerta de enlace responden de verdad, con el tiempo de respuesta en milisegundos.",
      },
      {
        title: "Todos tus adaptadores de red",
        description:
          "Ethernet, Wi-Fi e interfaces virtuales en una misma pantalla, con su estado, su dirección actual y los cambios pendientes.",
      },
      {
        title: "Pestaña de prueba de ping",
        description:
          "Haz ping a cualquier destino desde el adaptador de red que elijas, sin abrir una terminal ni memorizar comandos.",
      },
      {
        title: "Ligera, portátil y multilingüe",
        description:
          "Un único ejecutable de menos de 300 KB, sin instalación y sin telemetría. Interfaz en francés, inglés, alemán y español, con tema claro y oscuro.",
      },
    ],
    highlights: [
      {
        title: "Condiciones y RGPD en un clic",
        description:
          "Las condiciones de uso y el aviso de RGPD se aceptan con un clic en el primer inicio y luego se recuerdan.",
      },
      {
        title: "Detección de permisos",
        description: "La aplicación indica si dispone realmente de permisos de administrador.",
      },
      {
        title: "Conexiones de red",
        description: "Abre el panel de Windows y crea un acceso directo en el escritorio.",
      },
      {
        title: "Dirección fija recordada",
        description: "Windows conserva tu última dirección fija incluso con DHCP.",
      },
      {
        title: "Activación de adaptadores",
        description: "Activa o desactiva una interfaz sin salir de la aplicación.",
      },
    ],
  },
  steps: {
    eyebrow: "En tres pasos",
    title: {
      pre: "De la apertura a la nueva dirección, ",
      accent: "en unos segundos",
      post: "",
    },
    description:
      "Sin scripts, sin terminal y sin reinicios: una interfaz clara que muestra siempre el estado real de tus adaptadores.",
    items: [
      {
        title: "Abre la aplicación",
        description:
          "En Windows, acepta la solicitud de elevación. En macOS, la aplicación se abre al instante; la autorización se pedirá al aplicar un cambio.",
      },
      {
        title: "Elige el adaptador",
        description:
          "Selecciona Ethernet, Wi-Fi o cualquier otra interfaz. Su estado y su dirección IPv4 actual aparecen automáticamente.",
      },
      {
        title: "Cambia y prueba",
        description:
          "Pasa a DHCP o introduce una dirección fija, haz clic en «Cambiar» y luego en «Probar» para verificar la conexión.",
      },
    ],
    noteLabel: "Conviene saber:",
    note:
      "los cambios sin aplicar se proponen al cerrar. Puedes aplicarlos todos de una vez, salir sin cambiar nada o quedarte en la aplicación.",
  },
  downloads: {
    eyebrow: "Descargas",
    title: { pre: "Elige ", accent: "tu versión" },
    description:
      "Versión 1.1.3 · Gratis · Windows 8, 10 y 11 · macOS 12 o posterior. La misma app en todos tus dispositivos.",
    recommended: "Recomendado para tu dispositivo",
    windows: {
      title: "Windows",
      subtitle: "PCs y tabletas",
      compatibility: "Windows 8, 10 y 11",
      bullets: [
        "Windows 8, 10 y 11",
        "Sin instalación, ejecutable portátil",
        "Se requieren permisos de administrador",
      ],
      cta: "Descargar para Windows",
    },
    macIntel: {
      title: "macOS Intel",
      subtitle: "Mac con procesador Intel",
      compatibility: "macOS 12 (Monterey) o posterior",
      bullets: [
        "Mac con procesador Intel",
        "macOS 12 o posterior",
        "Instalación arrastrando y soltando",
      ],
      cta: "Descargar para Intel",
    },
    macArm: {
      title: "macOS Apple Silicon",
      subtitle: "Mac con chip de Apple",
      compatibility: "macOS 12 o posterior",
      bullets: [
        "Mac con chip M1, M2, M3 o M4",
        "macOS 12 o posterior",
        "Instalación arrastrando y soltando",
      ],
      cta: "Descargar para Apple Silicon",
    },
    macNotice:
      "Estás en un Mac. Abre el menú Apple → «Acerca de este Mac»: si la línea «Chip» indica Apple M1, M2, M3, M4 o posterior, elige Apple Silicon. Si la línea «Procesador» menciona Intel, elige la versión Intel.",
    installWin: {
      title: "Instalar en Windows",
      steps: [
        "Descarga el ZIP y extrae el ejecutable.",
        "Si aparece SmartScreen: «Más información» y luego «Ejecutar de todos modos».",
        "Acepta la solicitud de elevación: es necesaria para modificar un adaptador de red.",
        "Sin instalación: el archivo puede quedarse en el escritorio, en una carpeta o en un USB.",
      ],
    },
    installMac: {
      title: "Instalar en macOS",
      steps: [
        "Descarga el .dmg correspondiente a tu chip.",
        "Abre el DMG y arrastra Easy IP-Switch a la carpeta Aplicaciones.",
        "En el primer inicio, si macOS bloquea la aplicación: clic derecho en el icono → «Abrir».",
        "En el primer inicio, acepta las condiciones de uso y el aviso de RGPD.",
        "macOS 15 o posterior: permite el acceso a la red local para la prueba de ping.",
      ],
    },
    sizeWindows: "118 KB",
    sizeMac: "1,2 MB",
    freeLabel: "gratis",
    windowsWarning: {
      eyebrow: "Windows · SmartScreen",
      title: "¿Windows muestra un aviso?",
      description:
        "El ejecutable de Windows aún no está firmado con un certificado comercial. Por eso Windows puede mostrar «Windows protegió tu PC» o «Editor desconocido». No es un virus: el archivo lo compila Angeli Visions y se revisa antes de publicarse. La firma de código comercial está en estudio.",
      steps: [
        "Descarga el archivo desde esta página o desde GitHub Releases.",
        "Verifica la huella SHA-256 de abajo (el comando de PowerShell está en el README).",
        "Si aparece SmartScreen: haz clic en «Más información» y luego en «Ejecutar de todos modos».",
        "Acepta la solicitud de elevación (UAC): es necesaria para modificar un adaptador de red.",
      ],
      hashLabel: "Huella SHA-256 del ejecutable",
      zipCta: "Descargar ZIP + README",
      checksumsCta: "Ver huellas",
      githubCta: "GitHub Releases",
      note:
        "No ejecutes nunca una copia de otro sitio sin verificar su huella. El ZIP contiene el ejecutable, el README, la licencia y las huellas.",
    },
  },
  donation: {
    eyebrow: "Apoyar el proyecto",
    titlePre: "Apoya ",
    titleAccent: "Easy IP-Switch",
    description:
      "La aplicación se desarrolla de forma voluntaria y se distribuye gratis, sin publicidad ni versión de pago. Una donación ayuda a cubrir los costes de desarrollo, firma y alojamiento, y a financiar las próximas versiones.",
    cta: "Donar con PayPal",
    back: "Volver a las descargas",
    note: "Pago seguro con PayPal · Tarjeta bancaria aceptada · Donación puntual o recurrente",
    qrTitle: "Escanea con tu teléfono",
    qrHint: "o haz clic para abrir la página de PayPal",
    qrAlt: "Código QR para donar a Easy IP-Switch con PayPal",
  },
  faq: {
    eyebrow: "FAQ",
    title: { pre: "Preguntas ", accent: "frecuentes" },
    description: "¿Otra pregunta? Escríbenos a contact@angelivisions.com.",
    items: [
      {
        question: "¿La aplicación es realmente gratis?",
        answer:
          "Sí. Easy IP-Switch es gratis, sin publicidad, sin cuenta y sin versión de pago. Puedes hacer una donación por PayPal para apoyar el desarrollo, pero es totalmente opcional.",
      },
      {
        question: "¿Hacen falta permisos de administrador para cambiar la dirección IP?",
        answer:
          "En Windows, sí: la aplicación solicita elevación al iniciarse, porque modificar un adaptador de red es una operación protegida. En macOS, la autorización se pide cada vez que aplicas un cambio, y la app puede consultarse sin privilegios.",
      },
      {
        question: "¿Cómo elegir entre macOS Intel y Apple Silicon?",
        answer:
          "Abre el menú Apple → «Acerca de este Mac». Si la línea «Chip» indica Apple M1, M2, M3, M4 o posterior, descarga la versión Apple Silicon. Si la línea «Procesador» menciona Intel, elige la versión Intel.",
      },
      {
        question: "Windows muestra un aviso de SmartScreen, ¿es normal?",
        answer:
          "Sí. El ejecutable aún no está firmado con un certificado comercial, así que Windows puede mostrar «Windows protegió tu PC». Verifica la huella SHA-256 en la sección Descargas y luego haz clic en «Más información» y «Ejecutar de todos modos». La firma de código comercial está en estudio.",
      },
      {
        question: "¿La aplicación recopila datos?",
        answer:
          "No. Sin telemetría, sin cuenta y sin conexiones salientes salvo los pings que lances tú mismo a una dirección de tu red.",
      },
      {
        question: "¿Mis cambios se aplican de inmediato?",
        answer:
          "Cada adaptador tiene su botón «Cambiar». Si cierras la aplicación con cambios pendientes, una ventana te propone aplicarlos todos, salir sin aplicarlos o quedarte.",
      },
      {
        question: "¿Puedo volver a una dirección IP automática?",
        answer:
          "Sí. Selecciona «DHCP» en el adaptador y confirma: recibirá una dirección del router. En Windows, tu última dirección fija se conserva y se muestra como referencia.",
      },
    ],
  },
  footer: {
    tagline: "Una herramienta de Angeli Visions · v1.1.3",
    description:
      "La aplicación todo en uno para cambiar fácil y rápidamente de dirección IP, en Windows 8, 10, 11 y macOS.",
    appColumn: "Aplicación",
    siteColumn: "Angeli Visions",
    contactColumn: "Contacto y donaciones",
    site: "El sitio",
    legal: "Aviso legal",
    privacy: "Privacidad",
    donate: "Donar",
    rights: "Todos los derechos reservados.",
    disclaimer: "Easy IP-Switch se distribuye gratis, sin garantía de ningún tipo.",
  },
}

export const landingContent: Record<PageLocale, LandingContent> = { fr, en, de, es }
