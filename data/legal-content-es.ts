import type { LegalContent } from "./legal-content"

export const legalContentEs: LegalContent = {
  legalNotice: {
    meta: {
      title: "Aviso Legal",
      description:
        "Aviso legal de la sociedad Angeli Visions - Organizador de eventos y productor de espectáculos.",
    },
    title: "Aviso Legal",
    publisher: {
      heading: "Editor del sitio web",
      rows: [
        { label: "Denominación social", value: "Angeli Visions" },
        { label: "Forma jurídica", value: "SASU" },
        { label: "Sede social", value: "79 rue du Général Leclerc, 78400 Chatou, Francia" },
        { label: "Inscripción", value: "RCS Versailles 898 018 221" },
        { label: "IVA", value: "FR06898018221" },
        { label: "Licencia de espectáculos", value: "PLATESV-D-2022-000968" },
      ],
    },
    publicationDirector: {
      heading: "Director de la publicación",
      name: "Sr. Dani JELASSI",
      role: "en calidad de Presidente.",
      contactLabel: "Contacto:",
      contactEmail: "contact@angelivisions.com",
    },
    hosting: {
      heading: "Alojamiento del sitio",
      lead: "El sitio está alojado por",
      company: "OVH SAS",
      address: "Sede social: 2 rue Kellermann - 59100 Roubaix - Francia.",
      websiteLabel: "Sitio web:",
      websiteUrl: "https://www.ovhcloud.com",
    },
    commitments: {
      heading: "Compromisos",
      paragraphs: [
        "La sociedad Angeli Visions está adherida a la Economía Social y Solidaria (ESS).",
        "Nos comprometemos activamente en la lucha contra toda forma de discriminación y de violencia sexista y sexual en el ámbito cultural y de eventos.",
      ],
    },
    intellectualProperty: {
      heading: "Propiedad intelectual",
      body: "El conjunto de este sitio web se rige por la legislación francesa e internacional sobre derechos de autor y propiedad intelectual. Todos los derechos de reproducción están reservados, incluidos los documentos descargables y las representaciones iconográficas y fotográficas.",
    },
    question: {
      heading: "6. ¿Tiene alguna pregunta o litigio?",
      intro:
        "Para cualquier reclamación, le rogamos que complete nuestro formulario oficial a continuación. Trataremos su solicitud en un plazo de 48 horas laborables.",
    },
  },

  privacy: {
    meta: {
      title: "Política de Privacidad",
      description:
        "Política de privacidad y protección de datos personales de Angeli Visions.",
    },
    title: "Política de Privacidad",
    intro:
      "La protección de sus datos personales es una prioridad absoluta para Angeli Visions. Esta política de privacidad explica con transparencia qué datos recopilamos, cómo los utilizamos y cuáles son sus derechos fundamentales.",
    controller: {
      heading: "Responsable del tratamiento",
      body: "El responsable del tratamiento de los datos es la sociedad Angeli Visions, representada por su Presidente en el marco estricto del RGPD.",
      dpoLabel: "Delegado de Protección de Datos (DPD)",
      dpoName: "Sr. Dani JELASSI",
    },
    dataCollected: {
      heading: "Datos recopilados",
      items: [
        {
          title: "Formularios de contacto y presupuesto",
          description:
            "Nombre, apellidos, correo electrónico, teléfono y detalles del proyecto de evento o musical.",
        },
        {
          title: "Boletín",
          description:
            "Dirección de correo electrónico y nombre (recopilados únicamente con su consentimiento).",
        },
        {
          title: "Navegación",
          description: "Cookies técnicas y analíticas (dirección IP anonimizada).",
        },
      ],
    },
    purposes: {
      heading: "Finalidades del tratamiento",
      intro: "Utilizamos sus datos exclusivamente para:",
      items: [
        "Responder a solicitudes de presupuesto",
        "Enviar el boletín (opt-in)",
        "Optimizar la experiencia en el sitio web",
        "Cumplir las obligaciones fiscales",
      ],
    },
    rights: {
      heading: "Sus derechos fundamentales (RGPD)",
      items: [
        { title: "Derecho de acceso", description: "Consultar sus datos almacenados" },
        { title: "Rectificación", description: "Modificar su información" },
        { title: "Supresión", description: "Derecho al olvido definitivo" },
        { title: "Limitación", description: "Suspender el tratamiento" },
        { title: "Portabilidad", description: "Recuperar sus archivos" },
        { title: "Oposición", description: "Rechazar el uso comercial" },
      ],
    },
    contact: {
      heading: "Ejercer sus derechos",
      title: "Contactar con el Sr. Dani JELASSI (DPD)",
      intro:
        "Para cualquier solicitud relativa a sus datos personales o para ejercer sus derechos, utilice este formulario seguro.",
    },
  },

  cookies: {
    meta: {
      title: "Política de Cookies",
      description:
        "Información sobre el uso de cookies en el sitio web de Angeli Visions.",
    },
    title: "Política de Cookies",
    intro:
      "Esta política explica con transparencia cómo Angeli Visions utiliza cookies y tecnologías similares para reconocerle cuando visita nuestro sitio web. Nos comprometemos a respetar su privacidad.",
    whatIs: {
      heading: "¿Qué es una cookie?",
      body: "Una cookie es un pequeño archivo de datos almacenado en su dispositivo (ordenador, tableta o móvil) cuando navega por un sitio web. Permite al sitio recordar sus acciones y preferencias durante un período de tiempo para facilitar su navegación.",
    },
    used: {
      heading: "Las cookies que utilizamos",
      groups: [
        {
          title: "Cookies Esenciales",
          description:
            "Estas cookies son necesarias para el funcionamiento técnico del sitio web. No pueden desactivarse para garantizar su seguridad.",
          items: [
            "Seguridad (protección CSRF)",
            "Sesión de usuario",
            "Preferencias de idioma",
            "Preferencias de cookies",
          ],
        },
        {
          title: "Cookies Analíticas",
          description:
            "Nos ayudan a comprender cómo interactúan los visitantes con el sitio web (páginas vistas, tiempo de permanencia). Todos los datos son anonimizados.",
          items: ["Estadísticas de visitas", "Rendimiento del servidor", "Recorrido del usuario"],
        },
        {
          title: "Cookies de Marketing",
          description:
            "Se utilizan para mostrar anuncios relevantes o para medir la eficacia de nuestras campañas de marketing en otras plataformas.",
          items: ["Audiencia publicitaria", "Retargeting", "Seguimiento de conversiones"],
        },
      ],
    },
    manage: {
      heading: "Gestionar sus preferencias",
      intro:
        "Puede modificar su elección sobre las cookies en cualquier momento. Su comodidad y su privacidad son nuestra prioridad.",
    },
  },
}
