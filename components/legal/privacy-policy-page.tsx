import { Card, CardContent } from "@/components/ui/card"
import DpdContactForm from "@/components/dpd-contact-form"
import type { Locale } from "@/lib/i18n/locales"
import { getLegalContent } from "@/data/legal-content"

export default function PrivacyPolicyPage({ lang }: { lang: Locale }) {
  const content = getLegalContent(lang).privacy

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
          <section className="glassy-card p-10 rounded-[2.5rem] border border-white/5">
            <p className="text-slate-300 text-lg leading-relaxed">{content.intro}</p>
          </section>

          {/* 1. Data controller */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>1</StepNumber>
              <span className="title-gradient">{content.controller.heading}</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                {content.controller.body}
              </p>
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                <p className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
                  <span className="text-slate-400">{content.controller.dpoLabel}</span>
                  <span className="font-bold title-gradient text-xl">
                    {content.controller.dpoName}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Data collected */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>2</StepNumber>
              <span className="title-gradient">{content.dataCollected.heading}</span>
            </h2>
            <Card className="glassy-card border-white/10 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8">
                <ul className="space-y-6">
                  {content.dataCollected.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] mt-2.5 shrink-0 shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
                      <div>
                        <strong className="text-white text-lg block mb-1">{item.title}</strong>
                        <p className="text-slate-400 leading-relaxed">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* 3. Purposes */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>3</StepNumber>
              <span className="title-gradient">{content.purposes.heading}</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 mb-6 text-lg">{content.purposes.intro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.purposes.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl transition-all hover:bg-white/[0.05]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Your rights */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>4</StepNumber>
              <span className="title-gradient">{content.rights.heading}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {content.rights.items.map((right, idx) => (
                <div
                  key={idx}
                  className="glassy-card p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group"
                >
                  <h3 className="text-white font-bold mb-2 group-hover:text-amber-500 transition-colors">
                    {right.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{right.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Contact the DPO */}
          <section id="contact-dpd" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg gold-bg-gradient text-black flex items-center justify-center text-sm font-bold shadow-[0_0_15px_-3px_rgba(251,191,36,0.5)]">
                5
              </span>
              {content.contact.heading}
            </h2>
            <div className="glassy-card p-1 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
              <div className="bg-[#020617]/50 backdrop-blur-xl p-8 sm:p-12">
                <div className="max-w-2xl mx-auto space-y-8 text-center pb-8 border-b border-white/5 mb-8">
                  <h3 className="text-3xl font-bold tracking-tight">
                    <span className="title-gradient">{content.contact.title}</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed max-w-lg mx-auto">
                    {content.contact.intro}
                  </p>
                </div>
                <div className="max-w-2xl mx-auto">
                  <DpdContactForm />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
