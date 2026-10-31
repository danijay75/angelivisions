import type { Locale } from "@/lib/i18n/locales"

export interface AboutContent {
  meta: { title: string; description: string }
  hero: { eyebrow: string; title: string; subtitle: string; lead: string }
  facts: { value: string; label: string }[]
  mission: {
    number: string
    source: string
    title: string
    paragraphs: string[]
  }
  activities: {
    number: string
    source: string
    title: string
    intro: string
    primaryLabel: string
    primary: string[]
    secondaryLabel: string
    secondary: string[]
    note: string
  }
  governance: {
    number: string
    source: string
    title: string
    paragraphs: string[]
    columns: [string, string]
    rows: { role: string; coefficient: string }[]
    footnote: string
  }
  sharing: {
    number: string
    source: string
    title: string
    paragraphs: string[]
    stats: { value: string; label: string }[]
  }
  fund: {
    number: string
    source: string
    title: string
    paragraphs: string[]
    stat: { value: string; label: string }
  }
  synthesis: {
    title: string
    lead: string
    items: { title: string; text: string }[]
  }
  cta: { title: string; text: string; contact: string; quote: string }
  legalNote: string
}

const ABOUT: Record<Locale, AboutContent> = {
  fr: {
    meta: {
      title: "Notre mission",
      description:
        "Angeli Visions, entreprise culturelle de l'Économie Sociale et Solidaire : notre objet, notre gouvernance démocratique et le partage des bénéfices avec nos collaborateurs.",
    },
    hero: {
      eyebrow: "Angeli Visions",
      title: "Notre mission",
      subtitle: "Produire la culture, partager la valeur",
      lead:
        "Angeli Visions produit des spectacles vivants, des concerts et des contenus audiovisuels. Notre différence tient en trois engagements : une gouvernance démocratique, un partage des bénéfices avec les collaborateurs et un fonds dédié à la culture et à la solidarité. Voici, simplement, comment cela fonctionne.",
    },
    facts: [
      { value: "ESS", label: "Économie Sociale et Solidaire" },
      { value: "SASU", label: "à capital variable" },
      { value: "Jusqu'à 49 %", label: "des bénéfices partagés avec les collaborateurs" },
      { value: "Jusqu'à 33 %", label: "des bénéfices dédiés au fonds culturel et social" },
    ],
    mission: {
      number: "01",
      source: "Article 2 des statuts",
      title: "Notre raison d'être",
      paragraphs: [
        "Notre objet social est la production et l'organisation de spectacles vivants et de concerts, en France comme à l'étranger. Autour de ce cœur de métier, nous développons la production audiovisuelle, la promotion et la diffusion artistique, l'édition musicale et l'enregistrement sonore, sur tous supports physiques et numériques.",
        "Mais notre objet ne s'arrête pas à l'activité commerciale. Angeli Visions se réclame de l'Économie Sociale et Solidaire (ESS) et poursuit une finalité d'utilité sociale : promouvoir la diversité culturelle et musicale européenne ainsi que la solidarité continentale sous toutes ses formes. L'entreprise n'a donc pas pour seul intérêt le partage des bénéfices.",
        "Cette exigence a un coût, et nous l'assumons. Les activités sociales et les engagements environnementaux peuvent peser de manière significative sur le compte de résultat. Nous les considérons comme des investissements dans ce que nous sommes, et non comme des contraintes à contourner.",
      ],
    },
    activities: {
      number: "02",
      source: "Article 2 des statuts",
      title: "Ce que nous faisons",
      intro:
        "Deux niveaux d'activité, une même exigence de qualité et de sens.",
      primaryLabel: "Activité principale",
      primary: [
        "Production et organisation de spectacles vivants",
        "Concerts, tournées et événements musicaux",
      ],
      secondaryLabel: "Activités complémentaires",
      secondary: [
        "Production audiovisuelle sur supports physiques et numériques",
        "Promotion et diffusion artistique de tout type",
        "Édition musicale et enregistrement sonore",
        "Exploitation de lieux, fonds de commerce et équipements liés à ces activités",
        "Acquisition et exploitation de procédés et brevets",
        "Participations dans des projets connexes favorisant notre développement",
      ],
      note:
        "La société peut créer des succursales en France et à l'étranger. Son capital est variable, entre 450 € et 10 000 000 € : de nouveaux actionnaires peuvent la rejoindre sans alourdir les formalités. Le siège social est à Chatou, dans les Yvelines.",
    },
    governance: {
      number: "03",
      source: "Article 24 des statuts",
      title: "Une gouvernance qui partage le pouvoir",
      paragraphs: [
        "Dans la plupart des sociétés, une action vaut une voix. Chez nous, la voix de chacun dépend aussi de sa place réelle dans l'entreprise : celles et ceux qui portent le projet au quotidien pèsent davantage que le seul capital.",
        "Chaque collège dispose d'un coefficient qui multiplie son poids lors des votes en assemblée. Le principe est simple : plus la responsabilité est grande, plus la voix compte. Le travail et l'engagement sont ainsi reconnus à leur juste valeur, et le capital ne peut pas, à lui seul, décider de tout.",
      ],
      columns: ["Collège", "Coefficient de vote"],
      rows: [
        { role: "Associé et présidence", coefficient: "× 10" },
        { role: "Collaborateur manager et cadre dirigeant", coefficient: "× 5" },
        { role: "Collaborateur salarié cadre", coefficient: "× 2" },
        { role: "Collaborateur salarié", coefficient: "× 1" },
        { role: "Actionnaire", coefficient: "× 1" },
      ],
      footnote:
        "Ces coefficients s'appliquent aux votes en assemblée générale. L'objectif inscrit dans les statuts est une gouvernance juste et démocratique, où la décision se construit avec ceux qui font vivre la structure.",
    },
    sharing: {
      number: "04",
      source: "Article 25 des statuts",
      title: "Partager les bénéfices avec ceux qui les produisent",
      paragraphs: [
        "Quand l'entreprise réussit, celles et ceux qui la font fonctionner doivent en profiter. Dès que le bénéfice atteint 250 000 € à la clôture de l'exercice, Angeli Visions s'engage à redistribuer jusqu'à 49 % de ce bénéfice à ses collaborateurs.",
        "La répartition se fait au prorata temporis du nombre d'heures travaillées : chacun reçoit une part proportionnelle au temps consacré à l'entreprise dans l'année. Le pourcentage exact alloué aux collaborateurs est fixé en assemblée générale, dans la limite de ces 49 %.",
        "Les dividendes, eux, restent proportionnels au nombre de parts détenues par les actionnaires. Le partage avec les collaborateurs s'ajoute à la rémunération du capital ; il ne la remplace pas.",
      ],
      stats: [
        { value: "250 000 €", label: "seuil de bénéfice à atteindre" },
        { value: "Jusqu'à 49 %", label: "du bénéfice redistribué" },
        { value: "Au prorata", label: "des heures travaillées" },
      ],
    },
    fund: {
      number: "05",
      source: "Article 26 des statuts",
      title: "Un fonds pour la culture et la solidarité",
      paragraphs: [
        "Notre finalité sociale ne peut pas dépendre d'un geste ponctuel. C'est pourquoi les statuts créent une réserve obligatoire : le fonds de développement culturel et social.",
        "Dès que le bénéfice atteint 250 000 €, ce fonds peut être doté de jusqu'à 33 % du bénéfice. La part exacte est décidée chaque année en assemblée générale. Cette réserve finance nos actions en faveur de la diversité culturelle, de l'accès à la culture et de la solidarité.",
        "Autrement dit : une partie de ce que l'entreprise gagne est sanctuarisée pour ce qui fait son utilité sociale.",
      ],
      stat: { value: "Jusqu'à 33 %", label: "du bénéfice vers le fonds" },
    },
    synthesis: {
      title: "Ce que cela change",
      lead: "Trois engagements qui ne restent pas dans un tiroir.",
      items: [
        {
          title: "Pour les collaborateurs",
          text: "Une voix réelle dans les décisions et une part des bénéfices qu'ils contribuent à créer.",
        },
        {
          title: "Pour les artistes et partenaires",
          text: "Un interlocuteur stable, engagé sur le long terme, qui investit dans la création européenne.",
        },
        {
          title: "Pour le public",
          text: "Des projets exigeants, accessibles et ancrés dans les territoires.",
        },
        {
          title: "Pour les actionnaires",
          text: "Une entreprise qui grandit sans renier ses valeurs, avec des règles du jeu claires.",
        },
      ],
    },
    cta: {
      title: "Travailler avec nous",
      text: "Un projet de spectacle, de production ou de partenariat ? Parlons-en.",
      contact: "Nous contacter",
      quote:
        "Une entreprise culturelle peut être exigeante, rentable et utile. Nous refusons de choisir entre les trois.",
    },
    legalNote:
      "Cette page synthétise les articles 2 et 24 à 26 des statuts d'Angeli Visions. Elle ne s'y substitue pas : en cas de divergence, les statuts font foi.",
  },

  en: {
    meta: {
      title: "Our mission",
      description:
        "Angeli Visions, a cultural company of the Social and Solidarity Economy: our purpose, our democratic governance and profit sharing with our team.",
    },
    hero: {
      eyebrow: "Angeli Visions",
      title: "Our mission",
      subtitle: "Producing culture, sharing value",
      lead:
        "Angeli Visions produces live shows, concerts and audiovisual content. What sets us apart comes down to three commitments: democratic governance, profit sharing with our team, and a fund dedicated to culture and solidarity. Here is how it works, simply.",
    },
    facts: [
      { value: "SSE", label: "Social and Solidarity Economy" },
      { value: "SASU", label: "with variable capital" },
      { value: "Up to 49%", label: "of profits shared with the team" },
      { value: "Up to 33%", label: "of profits dedicated to the cultural and social fund" },
    ],
    mission: {
      number: "01",
      source: "Article 2 of the articles of association",
      title: "Our purpose",
      paragraphs: [
        "Our corporate purpose is the production and organisation of live shows and concerts, in France and abroad. Around this core business, we develop audiovisual production, artistic promotion and distribution, music publishing and sound recording, on all physical and digital media.",
        "But our purpose does not stop at commercial activity. Angeli Visions identifies with the Social and Solidarity Economy (SSE) and pursues a social utility objective: promoting European cultural and musical diversity, as well as continental solidarity in all its forms. The company's sole interest is therefore not the sharing of profits.",
        "This commitment has a cost, and we accept it. Social activities and environmental commitments can have a significant impact on the income statement. We see them as investments in who we are, not as constraints to work around.",
      ],
    },
    activities: {
      number: "02",
      source: "Article 2 of the articles of association",
      title: "What we do",
      intro: "Two levels of activity, one shared standard of quality and meaning.",
      primaryLabel: "Core activity",
      primary: [
        "Production and organisation of live shows",
        "Concerts, tours and music events",
      ],
      secondaryLabel: "Complementary activities",
      secondary: [
        "Audiovisual production on physical and digital media",
        "Artistic promotion and distribution of all kinds",
        "Music publishing and sound recording",
        "Operation of venues, businesses and equipment related to these activities",
        "Acquisition and operation of processes and patents",
        "Stakes in related projects that support our development",
      ],
      note:
        "The company may open branches in France and abroad. Its capital is variable, between €450 and €10,000,000: new shareholders can join without heavy formalities. Our registered office is in Chatou, in the Yvelines region.",
    },
    governance: {
      number: "03",
      source: "Article 24 of the articles of association",
      title: "Governance that shares power",
      paragraphs: [
        "In most companies, one share equals one vote. For us, each person's voice also depends on their actual role in the company: those who carry the project every day weigh more than capital alone.",
        "Each college has a coefficient that multiplies its weight in assembly votes. The principle is simple: the greater the responsibility, the greater the voice. Work and commitment are thus recognised at their true value, and capital alone cannot decide everything.",
      ],
      columns: ["College", "Voting coefficient"],
      rows: [
        { role: "Shareholder and chair", coefficient: "× 10" },
        { role: "Manager and senior executive", coefficient: "× 5" },
        { role: "Salaried executive staff", coefficient: "× 2" },
        { role: "Salaried employee", coefficient: "× 1" },
        { role: "Shareholder", coefficient: "× 1" },
      ],
      footnote:
        "These coefficients apply to votes at the general meeting. The objective written into the articles is fair, democratic governance, where decisions are built with the people who keep the organisation alive.",
    },
    sharing: {
      number: "04",
      source: "Article 25 of the articles of association",
      title: "Sharing profits with those who produce them",
      paragraphs: [
        "When the company succeeds, the people who make it work should benefit. As soon as profit reaches €250,000 at the end of the financial year, Angeli Visions commits to redistributing up to 49% of that profit to its team.",
        "The distribution is pro rata to the number of hours worked: each person receives a share proportional to the time they devoted to the company during the year. The exact percentage allocated to the team is set at the general meeting, within the 49% limit.",
        "Dividends remain proportional to the number of shares held by shareholders. Sharing with the team is added to the remuneration of capital; it does not replace it.",
      ],
      stats: [
        { value: "€250,000", label: "profit threshold to reach" },
        { value: "Up to 49%", label: "of profits redistributed" },
        { value: "Pro rata", label: "of hours worked" },
      ],
    },
    fund: {
      number: "05",
      source: "Article 26 of the articles of association",
      title: "A fund for culture and solidarity",
      paragraphs: [
        "Our social purpose cannot depend on one-off gestures. That is why the articles create a mandatory reserve: the cultural and social development fund.",
        "As soon as profit reaches €250,000, this fund may be allocated up to 33% of that profit. The exact share is decided each year at the general meeting. The reserve finances our actions in favour of cultural diversity, access to culture and solidarity.",
        "In other words: part of what the company earns is set aside for what makes it socially useful.",
      ],
      stat: { value: "Up to 33%", label: "of profits to the fund" },
    },
    synthesis: {
      title: "What this changes",
      lead: "Three commitments that do not stay in a drawer.",
      items: [
        {
          title: "For our team",
          text: "A real voice in decisions and a share of the profits they help to create.",
        },
        {
          title: "For artists and partners",
          text: "A stable, long-term partner that invests in European creation.",
        },
        {
          title: "For audiences",
          text: "Demanding, accessible projects rooted in local communities.",
        },
        {
          title: "For shareholders",
          text: "A company that grows without denying its values, with clear rules.",
        },
      ],
    },
    cta: {
      title: "Work with us",
      text: "A show, production or partnership project? Let's talk.",
      contact: "Contact us",
      quote:
        "A cultural company can be demanding, profitable and useful. We refuse to choose between the three.",
    },
    legalNote:
      "This page summarises articles 2 and 24 to 26 of Angeli Visions' articles of association. It does not replace them: in the event of any discrepancy, the articles prevail.",
  },

  es: {
    meta: {
      title: "Nuestra misión",
      description:
        "Angeli Visions, empresa cultural de la Economía Social y Solidaria: nuestro objeto, nuestra gobernanza democrática y el reparto de beneficios con nuestros colaboradores.",
    },
    hero: {
      eyebrow: "Angeli Visions",
      title: "Nuestra misión",
      subtitle: "Producir cultura, compartir valor",
      lead:
        "Angeli Visions produce espectáculos en vivo, conciertos y contenidos audiovisuales. Nuestra diferencia se resume en tres compromisos: una gobernanza democrática, el reparto de beneficios con los colaboradores y un fondo dedicado a la cultura y la solidaridad. Así funciona, de forma sencilla.",
    },
    facts: [
      { value: "ESS", label: "Economía Social y Solidaria" },
      { value: "SASU", label: "con capital variable" },
      { value: "Hasta 49 %", label: "de los beneficios compartidos con los colaboradores" },
      { value: "Hasta 33 %", label: "de los beneficios dedicados al fondo cultural y social" },
    ],
    mission: {
      number: "01",
      source: "Artículo 2 de los estatutos",
      title: "Nuestra razón de ser",
      paragraphs: [
        "Nuestro objeto social es la producción y organización de espectáculos en vivo y conciertos, en Francia y en el extranjero. En torno a esta actividad principal desarrollamos la producción audiovisual, la promoción y difusión artística, la edición musical y la grabación sonora, en cualquier soporte físico y digital.",
        "Pero nuestro objeto no se limita a la actividad comercial. Angeli Visions se reclama de la Economía Social y Solidaria (ESS) y persigue una finalidad de utilidad social: promover la diversidad cultural y musical europea, así como la solidaridad continental en todas sus formas. La empresa no tiene, por tanto, como único interés el reparto de beneficios.",
        "Esta exigencia tiene un coste, y lo asumimos. Las actividades sociales y los compromisos medioambientales pueden tener un impacto significativo en la cuenta de resultados. Los consideramos inversiones en lo que somos, no obstáculos que haya que esquivar.",
      ],
    },
    activities: {
      number: "02",
      source: "Artículo 2 de los estatutos",
      title: "Lo que hacemos",
      intro: "Dos niveles de actividad, una misma exigencia de calidad y sentido.",
      primaryLabel: "Actividad principal",
      primary: [
        "Producción y organización de espectáculos en vivo",
        "Conciertos, giras y eventos musicales",
      ],
      secondaryLabel: "Actividades complementarias",
      secondary: [
        "Producción audiovisual en soportes físicos y digitales",
        "Promoción y difusión artística de todo tipo",
        "Edición musical y grabación sonora",
        "Explotación de locales, fondos de comercio y equipos vinculados a estas actividades",
        "Adquisición y explotación de procedimientos y patentes",
        "Participaciones en proyectos conexos que favorezcan nuestro desarrollo",
      ],
      note:
        "La sociedad puede abrir sucursales en Francia y en el extranjero. Su capital es variable, entre 450 € y 10 000 000 €: nuevos accionistas pueden incorporarse sin trámites pesados. Nuestra sede social está en Chatou, en los Yvelines.",
    },
    governance: {
      number: "03",
      source: "Artículo 24 de los estatutos",
      title: "Una gobernanza que comparte el poder",
      paragraphs: [
        "En la mayoría de las sociedades, una acción vale un voto. En la nuestra, la voz de cada persona también depende de su lugar real en la empresa: quienes sostienen el proyecto a diario pesan más que el capital por sí solo.",
        "Cada colegio dispone de un coeficiente que multiplica su peso en las votaciones de la asamblea. El principio es sencillo: cuanto mayor es la responsabilidad, más cuenta la voz. Así se reconoce el trabajo y el compromiso en su justo valor, y el capital no puede decidirlo todo por sí solo.",
      ],
      columns: ["Colegio", "Coeficiente de voto"],
      rows: [
        { role: "Socio y presidencia", coefficient: "× 10" },
        { role: "Colaborador mánager y directivo", coefficient: "× 5" },
        { role: "Colaborador asalariado cuadro", coefficient: "× 2" },
        { role: "Colaborador asalariado", coefficient: "× 1" },
        { role: "Accionista", coefficient: "× 1" },
      ],
      footnote:
        "Estos coeficientes se aplican a las votaciones en la junta general. El objetivo inscrito en los estatutos es una gobernanza justa y democrática, en la que la decisión se construye con quienes hacen vivir la estructura.",
    },
    sharing: {
      number: "04",
      source: "Artículo 25 de los estatutos",
      title: "Compartir los beneficios con quienes los producen",
      paragraphs: [
        "Cuando la empresa tiene éxito, quienes la hacen funcionar deben beneficiarse. En cuanto el beneficio alcanza los 250 000 € al cierre del ejercicio, Angeli Visions se compromete a redistribuir hasta el 49 % de ese beneficio entre sus colaboradores.",
        "El reparto se realiza a prorrata del número de horas trabajadas: cada persona recibe una parte proporcional al tiempo dedicado a la empresa durante el año. El porcentaje exacto asignado a los colaboradores se fija en la junta general, dentro de ese límite del 49 %.",
        "Los dividendos siguen siendo proporcionales al número de participaciones de los accionistas. El reparto con los colaboradores se suma a la remuneración del capital; no la sustituye.",
      ],
      stats: [
        { value: "250 000 €", label: "umbral de beneficio que alcanzar" },
        { value: "Hasta 49 %", label: "del beneficio redistribuido" },
        { value: "A prorrata", label: "de las horas trabajadas" },
      ],
    },
    fund: {
      number: "05",
      source: "Artículo 26 de los estatutos",
      title: "Un fondo para la cultura y la solidaridad",
      paragraphs: [
        "Nuestra finalidad social no puede depender de un gesto puntual. Por eso los estatutos crean una reserva obligatoria: el fondo de desarrollo cultural y social.",
        "En cuanto el beneficio alcanza los 250 000 €, este fondo puede dotarse con hasta el 33 % del beneficio. La parte exacta se decide cada año en la junta general. La reserva financia nuestras acciones a favor de la diversidad cultural, el acceso a la cultura y la solidaridad.",
        "Dicho de otro modo: una parte de lo que gana la empresa queda reservada para aquello que constituye su utilidad social.",
      ],
      stat: { value: "Hasta 33 %", label: "del beneficio destinado al fondo" },
    },
    synthesis: {
      title: "Lo que esto cambia",
      lead: "Tres compromisos que no se quedan en un cajón.",
      items: [
        {
          title: "Para los colaboradores",
          text: "Una voz real en las decisiones y una parte de los beneficios que contribuyen a crear.",
        },
        {
          title: "Para artistas y socios",
          text: "Un interlocutor estable, comprometido a largo plazo, que invierte en la creación europea.",
        },
        {
          title: "Para el público",
          text: "Proyectos exigentes, accesibles y arraigados en los territorios.",
        },
        {
          title: "Para los accionistas",
          text: "Una empresa que crece sin renunciar a sus valores, con reglas del juego claras.",
        },
      ],
    },
    cta: {
      title: "Trabajar con nosotros",
      text: "¿Un proyecto de espectáculo, producción o colaboración? Hablemos.",
      contact: "Contactar",
      quote:
        "Una empresa cultural puede ser exigente, rentable y útil. Nos negamos a elegir entre las tres.",
    },
    legalNote:
      "Esta página resume los artículos 2 y 24 a 26 de los estatutos de Angeli Visions. No los sustituye: en caso de discrepancia, prevalecen los estatutos.",
  },
}

export function getAboutContent(lang: Locale): AboutContent {
  return ABOUT[lang] ?? ABOUT.fr
}

export default ABOUT
