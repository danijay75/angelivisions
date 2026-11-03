import type { MissionContent } from "./mission-content"

export const ourMission: MissionContent = {
  meta: {
    title: "Our mission",
    description:
      "Angeli Visions, a cultural company of the Social and Solidarity Economy: our purpose, our democratic corporate governance and profit sharing with our team.",
  },
  hero: {
    eyebrow: "Angeli Visions",
    title: "Our mission",
    subtitle: "Social and economic justice for culture",
    lead:
      "Angeli Visions produces live shows, concerts and audiovisual content. What sets us apart comes down to three commitments: democratic corporate governance, profit sharing with our team, and a fund dedicated to promoting European culture.",
  },
  facts: [
    { value: "SSE", label: "Social and Solidarity Economy" },
    { value: "Up to 49%", label: "of profits shared with the team" },
    { value: "Up to 33%", label: "of profits dedicated to the cultural fund" },
  ],
  mission: {
    number: "01",
    source: "Article 2 of the articles of association",
    title: "Our purpose",
    paragraphs: [
      "Our corporate purpose is the production and organisation of live shows and concerts, in France and abroad. Around this core business, we develop audiovisual production, artistic promotion and distribution.",
      "But our purpose does not stop at commercial activity. Angeli Visions identifies with the Social and Solidarity Economy (SSE) and pursues a social utility objective: promoting European cultural and musical diversity, as well as continental solidarity in all its forms. The company's sole interest is therefore not the sharing of profits.",
      "This commitment has a cost, and we accept it. Social activities and economic justice commitments can have a significant impact on the income statement. We see them as investments in who we are, not as constraints to work around.",
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
    ],
    note:
      "The SASU company may open branches in France and abroad. New shareholders can join without heavy formalities. Our registered office is in Chatou, in the Yvelines region.",
  },
  governance: {
    number: "03",
    source: "Article 24 of the articles of association",
    title: "Democratic corporate governance",
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
    title: "A fund for European cultural diversity",
    paragraphs: [
      "Our social purpose cannot depend on one-off gestures. That is why the articles create a mandatory reserve: the cultural development fund.",
      "As soon as profit reaches €250,000, this fund may be allocated up to 33% of that profit. The exact share is decided each year at the general meeting. The reserve finances our actions in favour of cultural diversity and access to culture throughout Europe.",
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
        text: "Diverse projects that reflect European society. They must be accessible and rooted in local communities.",
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
}
