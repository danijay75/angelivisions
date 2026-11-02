import { Sparkles } from "lucide-react"
import VerifyCookieButton from "./verify-cookie-button"
import type { Locale } from "@/lib/i18n/locales"
import { getLegalContent } from "@/data/legal-content"

export default function CookiePolicyPage({ lang }: { lang: Locale }) {
  const content = getLegalContent(lang).cookies

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

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg sunset-gradient text-black flex items-center justify-center text-sm font-bold shadow-[0_0_15px_-3px_rgba(251,191,36,0.5)]">
                ?
              </span>
              {content.whatIs.heading}
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed">{content.whatIs.body}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg sunset-gradient text-black flex items-center justify-center text-sm font-bold shadow-[0_0_15px_-3px_rgba(251,191,36,0.5)]">
                <Sparkles className="w-4 h-4" />
              </span>
              {content.used.heading}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {content.used.groups.map((group) => (
                <div
                  key={group.title}
                  className="glassy-card p-8 rounded-[2rem] border border-white/5 group hover:border-amber-500/30 transition-all"
                >
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">
                    {group.title}
                  </h3>
                  <p className="text-slate-400 mb-6">{group.description}</p>
                  {group.items.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-xs text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="text-center pt-8">
            <div className="glassy-card p-12 rounded-[3rem] border-white/10 sunset-gradient bg-opacity-5">
              <h2 className="text-3xl font-bold text-white mb-4">{content.manage.heading}</h2>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto">{content.manage.intro}</p>
              <VerifyCookieButton />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
