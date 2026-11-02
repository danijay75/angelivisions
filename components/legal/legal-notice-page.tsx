import { Card, CardContent } from "@/components/ui/card"
import ReclamationsForm from "@/components/reclamations-form"
import type { Locale } from "@/lib/i18n/locales"
import { getLegalContent } from "@/data/legal-content"

export default function LegalNoticePage({ lang }: { lang: Locale }) {
  const content = getLegalContent(lang).legalNotice

  const StepNumber = ({ children }: { children: React.ReactNode }) => (
    <span className="w-10 h-10 rounded-xl gold-bg-gradient text-black flex items-center justify-center text-sm font-black shadow-[0_0_20px_-5px_rgba(255,215,0,0.5)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
      {children}
    </span>
  )

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden pt-32 pb-20">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orb orb-orange animate-orb opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orb orb-blue animate-orb opacity-10" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-16 text-center tracking-tight leading-tight">
          <span className="title-gradient">{content.title}</span>
        </h1>

        <div className="space-y-12">
          {/* 1. Website publisher */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>1</StepNumber>
              <span className="title-gradient">{content.publisher.heading}</span>
            </h2>
            <Card className="glassy-card border-white/10 rounded-[2rem] text-white overflow-hidden transition-all duration-500 hover:border-white/20">
              <CardContent className="p-8 space-y-4">
                {content.publisher.rows.map((row, index) => (
                  <p
                    key={row.label}
                    className={
                      index === content.publisher.rows.length - 1
                        ? "flex flex-col sm:flex-row sm:justify-between"
                        : "flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2"
                    }
                  >
                    <span className="text-slate-400">{row.label}</span>
                    <span className="font-semibold text-white">{row.value}</span>
                  </p>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* 2. Publication director */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>2</StepNumber>
              <span className="title-gradient">{content.publicationDirector.heading}</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed">
                <span className="title-gradient font-bold text-xl">
                  {content.publicationDirector.name}
                </span>
                , {content.publicationDirector.role}
              </p>
              <p className="mt-4 flex items-center gap-2">
                <span className="text-slate-400">{content.publicationDirector.contactLabel}</span>
                <a
                  href={`mailto:${content.publicationDirector.contactEmail}`}
                  className="title-gradient font-bold hover:opacity-80 transition-opacity"
                >
                  {content.publicationDirector.contactEmail}
                </a>
              </p>
            </div>
          </section>

          {/* 3. Hosting */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>3</StepNumber>
              <span className="title-gradient">{content.hosting.heading}</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed">
                {content.hosting.lead} <strong className="text-white">{content.hosting.company}</strong>.
                <br />
                {content.hosting.address}
                <br />
                {content.hosting.websiteLabel}{" "}
                <a
                  href={content.hosting.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="title-gradient font-bold hover:opacity-80 transition-opacity"
                >
                  {content.hosting.websiteUrl.replace(/^https?:\/\//, "")}
                </a>
              </p>
            </div>
          </section>

          {/* 4. Commitments */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>4</StepNumber>
              <span className="title-gradient">{content.commitments.heading}</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5 border-l-amber-500/50">
              {content.commitments.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "text-slate-300 text-lg leading-relaxed mb-4 italic"
                      : "text-slate-300 text-lg leading-relaxed"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* 5. Intellectual property */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>5</StepNumber>
              <span className="title-gradient">{content.intellectualProperty.heading}</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed">
                {content.intellectualProperty.body}
              </p>
            </div>
          </section>

          <section className="text-center pt-8">
            <div className="glassy-card p-10 rounded-[2.5rem] border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 sunset-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-700" />
              <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
                {content.question.heading}
              </h2>
              <p className="text-slate-300 mb-12 max-w-lg mx-auto relative z-10">
                {content.question.intro}
              </p>

              <div className="max-w-2xl mx-auto text-left relative z-10 bg-slate-950/40 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
                <ReclamationsForm lang={lang} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
