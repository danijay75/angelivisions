import type { LegalContent } from "./legal-content"

export const legalContentFr: LegalContent = {
  legalNotice: {
    meta: {
      title: "Mentions Légales",
      description:
        "Mentions légales de la société Angeli Visions - Organisateur d'événements.",
    },
    title: "Mentions Légales",
    publisher: {
      heading: "Éditeur du site",
      rows: [
        { label: "Dénomination sociale", value: "Angeli Visions" },
        { label: "Forme juridique", value: "SASU" },
        { label: "Siège social", value: "79 rue du Général Leclerc, 78400 Chatou" },
        { label: "Immatriculation", value: "RCS Versailles 898 018 221" },
        { label: "TVA", value: "FR06898018221" },
        { label: "Licence spectacles", value: "PLATESV-D-2022-000968" },
      ],
    },
    publicationDirector: {
      heading: "Directeur de la publication",
      name: "M. Dani JELASSI",
      role: "en qualité de Président.",
      contactLabel: "Contact :",
      contactEmail: "contact@angelivisions.com",
    },
    hosting: {
      heading: "Hébergement du site",
      lead: "Le site est hébergé par",
      company: "OVH SAS",
      address: "Siège social : 2 rue Kellermann - 59100 Roubaix - France.",
      websiteLabel: "Site web :",
      websiteUrl: "https://www.ovhcloud.com",
    },
    commitments: {
      heading: "Engagements",
      paragraphs: [
        "La société Angeli Visions est adhérente de l'Économie Sociale et Solidaire (ESS).",
        "Nous nous engageons activement dans la lutte contre toute forme de discrimination et de violence sexiste et sexuelle dans le milieu culturel et événementiel.",
      ],
    },
    intellectualProperty: {
      heading: "Propriété intellectuelle",
      body: "L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.",
    },
    question: {
      heading: "6. Une question ou un litige ?",
      intro:
        "Pour toute réclamation, veuillez remplir notre formulaire officiel ci-dessous. Nous traiterons votre demande sous 48h ouvrées.",
    },
  },

  privacy: {
    meta: {
      title: "Politique de Confidentialité",
      description:
        "Politique de confidentialité et protection des données personnelles d'Angeli Visions.",
    },
    title: "Politique de Confidentialité",
    intro:
      "La protection de vos données personnelles est une priorité absolue pour Angeli Visions. Cette politique de confidentialité explique avec transparence quelles données nous collectons, comment nous les utilisons et quels sont vos droits fondamentaux.",
    controller: {
      heading: "Responsable du traitement",
      body: "Le responsable du traitement des données est la société Angeli Visions, représentée par son Président dans le cadre strict du RGPD.",
      dpoLabel: "Délégué à la Protection des Données (DPD)",
      dpoName: "M. Dani JELASSI",
    },
    dataCollected: {
      heading: "Données collectées",
      items: [
        {
          title: "Formulaires de contact et devis",
          description:
            "Nom, prénom, email, téléphone, détails du projet événementiel ou musical.",
        },
        {
          title: "Newsletter",
          description: "Adresse email et nom (collectés uniquement sur consentement).",
        },
        {
          title: "Navigation",
          description: "Cookies techniques et analytiques (adresse IP anonymisée).",
        },
      ],
    },
    purposes: {
      heading: "Finalités du traitement",
      intro: "Nous utilisons vos données exclusivement pour :",
      items: [
        "Réponse aux demandes de devis",
        "Envoi de la newsletter (Opt-in)",
        "Optimisation de l'expérience site",
        "Respect des obligations fiscales",
      ],
    },
    rights: {
      heading: "Vos droits fondamentaux (RGPD)",
      items: [
        { title: "Droit d'accès", description: "Consulter vos données stockées" },
        { title: "Rectification", description: "Modifier vos informations" },
        { title: "Effacement", description: "Droit à l'oubli définitif" },
        { title: "Limitation", description: "Suspendre le traitement" },
        { title: "Portabilité", description: "Récupérer vos fichiers" },
        { title: "Opposition", description: "Refuser l'usage marketing" },
      ],
    },
    contact: {
      heading: "Exercer vos droits",
      title: "Contacter M. Dani JELASSI (DPD)",
      intro:
        "Pour toute demande concernant vos données personnelles ou pour exercer vos droits, veuillez utiliser ce formulaire sécurisé.",
    },
  },

  cookies: {
    meta: {
      title: "Politique des Cookies",
      description:
        "Informations sur l'utilisation des cookies sur le site Angeli Visions.",
    },
    title: "Politique des Cookies",
    intro:
      "Cette politique explique avec transparence comment Angeli Visions utilise des cookies et technologies similaires pour vous reconnaître lorsque vous visitez notre site Web. Nous nous engageons à respecter votre vie privée.",
    whatIs: {
      heading: "Qu'est-ce qu'un cookie ?",
      body: "Un cookie est un petit fichier de données stocké sur votre appareil (ordinateur, tablette, mobile) lorsque vous naviguez sur un site. Il permet au site de mémoriser vos actions et préférences sur une période donnée pour fluidifier votre navigation.",
    },
    used: {
      heading: "Les cookies que nous utilisons",
      groups: [
        {
          title: "Cookies Essentiels",
          description:
            "Ces cookies sont nécessaires au fonctionnement technique du site. Ils ne peuvent pas être désactivés pour garantir votre sécurité.",
          items: [
            "Sécurité (protection CSRF)",
            "Session utilisateur",
            "Préférences de langue",
            "Préférences de cookies",
          ],
        },
        {
          title: "Cookies Analytiques",
          description:
            "Ils nous aident à comprendre comment les visiteurs interagissent avec le site (pages vues, temps passé). Toutes les données sont anonymisées.",
          items: ["Statistiques de visite", "Performance serveur", "Parcours utilisateur"],
        },
        {
          title: "Cookies Marketing",
          description:
            "Utilisés pour afficher des publicités pertinentes ou suivre l'efficacité de nos campagnes marketing sur d'autres plateformes.",
          items: ["Audience publicitaire", "Retargeting", "Conversion tracking"],
        },
      ],
    },
    manage: {
      heading: "Gérer vos préférences",
      intro:
        "Vous pouvez modifier votre choix concernant les cookies à tout moment. Votre confort et votre vie privée sont notre priorité.",
    },
  },
}
