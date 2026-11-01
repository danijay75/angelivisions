import type { MissionContent } from "./mission-content"

export const notreMission: MissionContent = {
  meta: {
    title: "Notre mission",
    description:
      "Angeli Visions, entreprise culturelle de l'Économie Sociale et Solidaire : notre objet, notre gouvernance démocratique et le partage des bénéfices avec nos collaborateurs.",
  },
  hero: {
    eyebrow: "Angeli Visions",
    title: "Notre mission",
    subtitle: "Une justice sociale et économique pour la culture",
    lead:
      "Angeli Visions produit des spectacles vivants, des concerts et des contenus audiovisuels. Notre différence tient en trois engagements : une gouvernance démocratique, un partage des bénéfices avec les collaborateurs et un fonds dédié à la promotion de la culture européenne.",
  },
  facts: [
    { value: "ESS", label: "Économie Sociale et Solidaire" },
    { value: "SASU", label: "à capital variable" },
    { value: "Jusqu'à 49 %", label: "des bénéfices partagés avec les collaborateurs" },
    { value: "Jusqu'à 33 %", label: "des bénéfices dédiés au fonds culturel" },
  ],
  mission: {
    number: "01",
    source: "Article 2 des statuts",
    title: "Notre raison d'être",
    paragraphs: [
      "Notre objet social est la production et l'organisation de spectacles vivants et de concerts, en France comme à l'étranger. Autour de ce cœur de métier, nous développons la production audiovisuelle, la promotion et la diffusion artistique.",
      "Mais notre objet ne s'arrête pas à l'activité commerciale. Angeli Visions se réclame de l'Économie Sociale et Solidaire (ESS) et poursuit une finalité d'utilité sociale : promouvoir la diversité culturelle et musicale européenne ainsi que la solidarité continentale sous toutes ses formes. L'entreprise n'a donc pas pour seul intérêt le partage des bénéfices.",
      "Cette exigence a un coût, et nous l'assumons. Les activités sociales et les engagements de justice économique peuvent peser de manière significative sur le compte de résultat. Nous les considérons comme des investissements dans ce que nous sommes, et non comme des contraintes à contourner.",
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
    title: "Un fonds pour la diversité culturelle européenne.",
    paragraphs: [
      "Notre finalité sociale ne peut pas dépendre d'un geste ponctuel. C'est pourquoi les statuts créent une réserve obligatoire : le fonds de développement culturel.",
      "Dès que le bénéfice atteint 250 000 €, ce fonds peut être doté de jusqu'à 33 % du bénéfice. La part exacte est décidée chaque année en assemblée générale. Cette réserve finance nos actions en faveur de la diversité culturelle et de l'accès à la culture partout en Europe.",
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
        text: "Des projets divers, à l'image de la société européenne. Ils doivent être accessibles et ancrés dans les territoires.",
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
}
