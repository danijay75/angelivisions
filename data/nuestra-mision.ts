import type { MissionContent } from "./mission-content"

export const nuestraMision: MissionContent = {
  meta: {
    title: "Nuestra misión",
    description:
      "Angeli Visions, empresa cultural de la Economía Social y Solidaria: nuestro objeto, nuestra gobernanza democrática y el reparto de beneficios con nuestros colaboradores.",
  },
  hero: {
    eyebrow: "Angeli Visions",
    title: "Nuestra misión",
    subtitle: "Justicia social y económica para la cultura",
    lead:
      "Angeli Visions produce espectáculos en vivo, conciertos y contenidos audiovisuales. Nuestra diferencia se resume en tres compromisos: una gobernanza democrática, el reparto de beneficios con los colaboradores y un fondo dedicado a la promoción de la cultura europea.",
  },
  facts: [
    { value: "ESS", label: "Economía Social y Solidaria" },
    { value: "Hasta 49 %", label: "de los beneficios compartidos con los colaboradores" },
    { value: "Hasta 33 %", label: "de los beneficios dedicados al fondo cultural" },
  ],
  mission: {
    number: "01",
    source: "Artículo 2 de los estatutos",
    title: "Nuestra razón de ser",
    paragraphs: [
      "Nuestro objeto social es la producción y organización de espectáculos en vivo y conciertos, en Francia y en el extranjero. En torno a esta actividad principal desarrollamos la producción audiovisual, la promoción y difusión artística.",
      "Pero nuestro objeto no se limita a la actividad comercial. Angeli Visions se reclama de la Economía Social y Solidaria (ESS) y persigue una finalidad de utilidad social: promover la diversidad cultural y musical europea, así como la solidaridad continental en todas sus formas. La empresa no tiene, por tanto, como único interés el reparto de beneficios.",
      "Esta exigencia tiene un coste, y lo asumimos. Las actividades sociales y los compromisos de justicia económica pueden tener un impacto significativo en la cuenta de resultados. Los consideramos inversiones en lo que somos, no obstáculos que haya que esquivar.",
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
    title: "Un fondo para la diversidad cultural europea",
    paragraphs: [
      "Nuestra finalidad social no puede depender de un gesto puntual. Por eso los estatutos crean una reserva obligatoria: el fondo de desarrollo cultural.",
      "En cuanto el beneficio alcanza los 250 000 €, este fondo puede dotarse con hasta el 33 % del beneficio. La parte exacta se decide cada año en la junta general. La reserva financia nuestras acciones a favor de la diversidad cultural y el acceso a la cultura en toda Europa.",
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
        text: "Proyectos diversos, a imagen de la sociedad europea. Deben ser accesibles y estar arraigados en los territorios.",
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
}
