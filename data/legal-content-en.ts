import type { LegalContent } from "./legal-content"

export const legalContentEn: LegalContent = {
  legalNotice: {
    meta: {
      title: "Legal Notice",
      description:
        "Legal notice for Angeli Visions - Event organiser and live show producer.",
    },
    title: "Legal Notice",
    publisher: {
      heading: "Website publisher",
      rows: [
        { label: "Company name", value: "Angeli Visions" },
        { label: "Legal form", value: "SASU" },
        { label: "Registered office", value: "79 rue du Général Leclerc, 78400 Chatou, France" },
        { label: "Registration", value: "RCS Versailles 898 018 221" },
        { label: "VAT", value: "FR06898018221" },
        { label: "Entertainment licence", value: "PLATESV-D-2022-000968" },
      ],
    },
    publicationDirector: {
      heading: "Publication director",
      name: "Mr. Dani JELASSI",
      role: "in his capacity as President.",
      contactLabel: "Contact:",
      contactEmail: "contact@angelivisions.com",
    },
    hosting: {
      heading: "Website hosting",
      lead: "The website is hosted by",
      company: "OVH SAS",
      address: "Registered office: 2 rue Kellermann - 59100 Roubaix - France.",
      websiteLabel: "Website:",
      websiteUrl: "https://www.ovhcloud.com",
    },
    commitments: {
      heading: "Commitments",
      paragraphs: [
        "Angeli Visions is a member of the Social and Solidarity Economy (ESS).",
        "We are actively committed to combating all forms of discrimination and gender-based and sexual violence in the cultural and events sector.",
      ],
    },
    intellectualProperty: {
      heading: "Intellectual property",
      body: "This entire website is governed by French and international copyright and intellectual property law. All reproduction rights are reserved, including for downloadable documents and iconographic and photographic representations.",
    },
    question: {
      heading: "6. A question or a dispute?",
      intro:
        "For any complaint, please complete our official form below. We will process your request within 48 business hours.",
    },
  },

  privacy: {
    meta: {
      title: "Privacy Policy",
      description:
        "Privacy policy and personal data protection of Angeli Visions.",
    },
    title: "Privacy Policy",
    intro:
      "Protecting your personal data is an absolute priority for Angeli Visions. This privacy policy explains transparently what data we collect, how we use it and what your fundamental rights are.",
    controller: {
      heading: "Data controller",
      body: "The data controller is Angeli Visions, represented by its President in strict compliance with the GDPR.",
      dpoLabel: "Data Protection Officer (DPO)",
      dpoName: "Mr. Dani JELASSI",
    },
    dataCollected: {
      heading: "Data collected",
      items: [
        {
          title: "Contact and quote forms",
          description:
            "Name, email address, phone number and details of the event or music project.",
        },
        {
          title: "Newsletter",
          description: "Email address and name (collected only with your consent).",
        },
        {
          title: "Browsing",
          description: "Technical and analytical cookies (anonymised IP address).",
        },
      ],
    },
    purposes: {
      heading: "Purposes of processing",
      intro: "We use your data exclusively to:",
      items: [
        "Respond to quote requests",
        "Send the newsletter (opt-in)",
        "Improve the website experience",
        "Comply with tax obligations",
      ],
    },
    rights: {
      heading: "Your fundamental rights (GDPR)",
      items: [
        { title: "Right of access", description: "View the data we store" },
        { title: "Rectification", description: "Correct your information" },
        { title: "Erasure", description: "Right to be forgotten permanently" },
        { title: "Restriction", description: "Suspend processing" },
        { title: "Portability", description: "Retrieve your files" },
        { title: "Objection", description: "Refuse marketing use" },
      ],
    },
    contact: {
      heading: "Exercise your rights",
      title: "Contact Mr. Dani JELASSI (DPO)",
      intro:
        "For any request concerning your personal data or to exercise your rights, please use this secure form.",
    },
  },

  cookies: {
    meta: {
      title: "Cookie Policy",
      description: "Information about the use of cookies on the Angeli Visions website.",
    },
    title: "Cookie Policy",
    intro:
      "This policy explains transparently how Angeli Visions uses cookies and similar technologies to recognise you when you visit our website. We are committed to respecting your privacy.",
    whatIs: {
      heading: "What is a cookie?",
      body: "A cookie is a small data file stored on your device (computer, tablet or mobile) when you browse a website. It allows the site to remember your actions and preferences over a period of time, making your browsing experience smoother.",
    },
    used: {
      heading: "The cookies we use",
      groups: [
        {
          title: "Essential Cookies",
          description:
            "These cookies are necessary for the technical operation of the website. They cannot be disabled in order to keep you secure.",
          items: [
            "Security (CSRF protection)",
            "User session",
            "Language preferences",
            "Cookie preferences",
          ],
        },
        {
          title: "Analytical Cookies",
          description:
            "They help us understand how visitors interact with the website (pages viewed, time spent). All data is anonymised.",
          items: ["Visit statistics", "Server performance", "User journey"],
        },
        {
          title: "Marketing Cookies",
          description:
            "Used to display relevant advertisements or to track the effectiveness of our marketing campaigns on other platforms.",
          items: ["Advertising audience", "Retargeting", "Conversion tracking"],
        },
      ],
    },
    manage: {
      heading: "Manage your preferences",
      intro:
        "You can change your cookie choices at any time. Your comfort and privacy are our priority.",
    },
  },
}
