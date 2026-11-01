import Link from "next/link"
import {
  ArrowRight,
  Film,
  Globe2,
  HandCoins,
  Landmark,
  Music2,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Locale } from "@/lib/i18n/locales"
import { getMissionContent } from "@/data/mission-content"

const SYNTHESIS_ICONS = [Users, Music2, Globe2, Landmark]

function SectionHeading({
  number,
  title,
  source,
}: {
  number: string
  title: string
  source: string
}) {
  return (
    <div className="flex items-start gap-5 mb-8">
      <span className="shrink-0 w-12 h-12 rounded-xl gold-bg-gradient text-black flex items-center justify-center text-sm font-black shadow-[0_0_20px_-5px_rgba(255,215,0,0.5)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
        {number}
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500/80 mb-2">
          {source}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold title-gradient leading-tight">
          {title}
        </h2>
      </div>
    </div>
  )
}

export default function MissionPage({ lang }: { lang: Locale }) {
  const content = getMissionContent(lang)

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden pb-24">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orb orb-orange animate-orb opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orb orb-blue animate-orb opacity-10" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Hero */}
        <header className="text-center pt-8 pb-16">
          <p className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-amber-500 mb-6">
            <span className="w-8 h-px bg-amber-500/60" />
            {content.hero.eyebrow}
            <span className="w-8 h-px bg-amber-500/60" />
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.1]">
            <span className="title-gradient">{content.hero.title}</span>
          </h1>
          <p className="text-xl md:text-2xl font-display font-medium text-amber-200/90 mb-6">
            {content.hero.subtitle}
          </p>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-display">
            {content.hero.lead}
          </p>
        </header>

        {/* Key facts */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {content.facts.map((fact) => (
            <div
              key={fact.value}
              className="glassy-card rounded-3xl p-5 text-center flex flex-col justify-center min-h-[112px]"
            >
              <span className="text-xl md:text-2xl font-bold title-gradient mb-2">
                {fact.value}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 leading-snug">
                {fact.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-20">
          {/* 01 — Mission (article 2) */}
          <section className="group">
            <SectionHeading
              number={content.mission.number}
              title={content.mission.title}
              source={content.mission.source}
            />
            <Card className="glassy-card border-white/10 rounded-[2rem] text-white overflow-hidden">
              <CardContent className="p-8 md:p-10 space-y-5">
                {content.mission.paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={
                      index === 0
                        ? "text-lg md:text-xl text-white leading-relaxed font-display"
                        : "text-slate-300 leading-relaxed font-display"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
                <div className="flex items-start gap-3 pt-4 border-t border-white/10">
                  <ShieldCheck className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-200/90 italic leading-relaxed">
                    {content.cta.quote}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 02 — Activities (article 2) */}
          <section className="group">
            <SectionHeading
              number={content.activities.number}
              title={content.activities.title}
              source={content.activities.source}
            />
            <p className="text-slate-300 mb-6 font-display">
              {content.activities.intro}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassy-card border-amber-500/20 rounded-[2rem] text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <Music2 className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm uppercase tracking-widest text-amber-500">
                      {content.activities.primaryLabel}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {content.activities.primary.map((item) => (
                      <li
                        key={item}
                        className="text-lg text-white leading-snug font-display"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="glassy-card border-white/10 rounded-[2rem] text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <Film className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm uppercase tracking-widest text-slate-400">
                      {content.activities.secondaryLabel}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {content.activities.secondary.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed font-display"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mt-5 font-display">
              {content.activities.note}
            </p>
          </section>

          {/* 03 — Governance (article 24) */}
          <section className="group">
            <SectionHeading
              number={content.governance.number}
              title={content.governance.title}
              source={content.governance.source}
            />
            <Card className="glassy-card border-white/10 rounded-[2rem] text-white overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-4 mb-8">
                  <Scale className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
                  <div className="space-y-4">
                    {content.governance.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-slate-300 leading-relaxed font-display"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-left">
                    <caption className="sr-only">
                      {content.governance.title}
                    </caption>
                    <thead>
                      <tr className="bg-white/[0.04]">
                        <th
                          scope="col"
                          className="px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium"
                        >
                          {content.governance.columns[0]}
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium text-right"
                        >
                          {content.governance.columns[1]}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {content.governance.rows.map((row) => (
                        <tr key={row.role}>
                          <td className="px-5 py-4 text-sm text-slate-200 font-display">
                            {row.role}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="inline-flex min-w-[64px] justify-center rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-sm font-bold text-amber-400">
                              {row.coefficient}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mt-5 italic">
                  {content.governance.footnote}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 04 — Profit sharing (article 25) */}
          <section className="group">
            <SectionHeading
              number={content.sharing.number}
              title={content.sharing.title}
              source={content.sharing.source}
            />
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {content.sharing.stats.map((stat) => (
                <div
                  key={stat.value}
                  className="glassy-card rounded-3xl p-6 text-center flex flex-col justify-center min-h-[120px]"
                >
                  <span className="text-2xl font-bold title-gradient mb-2">
                    {stat.value}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <Card className="glassy-card border-white/10 rounded-[2rem] text-white overflow-hidden">
              <CardContent className="p-8 md:p-10 space-y-4">
                <div className="flex items-start gap-4">
                  <HandCoins className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
                  <div className="space-y-4">
                    {content.sharing.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-slate-300 leading-relaxed font-display"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 05 — Cultural & social fund (article 26) */}
          <section className="group">
            <SectionHeading
              number={content.fund.number}
              title={content.fund.title}
              source={content.fund.source}
            />
            <Card className="glassy-card border-white/10 rounded-[2rem] text-white overflow-hidden relative">
              <div className="absolute inset-0 sunset-gradient opacity-[0.04] pointer-events-none" />
              <CardContent className="p-8 md:p-10 relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
                <div className="space-y-4">
                  {content.fund.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-slate-300 leading-relaxed font-display"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center rounded-3xl border border-amber-500/20 bg-amber-500/[0.06] px-8 py-6 text-center">
                  <span className="text-3xl font-bold title-gradient mb-2">
                    {content.fund.stat.value}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 max-w-[150px] leading-snug">
                    {content.fund.stat.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Synthesis */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold title-gradient mb-3">
                {content.synthesis.title}
              </h2>
              <p className="text-slate-400 font-display">
                {content.synthesis.lead}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {content.synthesis.items.map((item, index) => {
                const Icon = SYNTHESIS_ICONS[index] ?? Users
                return (
                  <div
                    key={item.title}
                    className="glassy-card rounded-3xl p-6 flex gap-4 items-start"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-display">
                        {item.text}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="glassy-card p-10 md:p-14 rounded-[2.5rem] border-white/10 relative overflow-hidden text-center">
              <div className="absolute inset-0 sunset-gradient opacity-5 pointer-events-none" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
                {content.cta.title}
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10 font-display">
                {content.cta.text}
              </p>
              <Link
                href={`/${lang}/contacts`}
                className="relative z-10 inline-flex items-center gap-2 sunset-gradient text-white font-medium px-8 py-3.5 rounded-2xl transition-all duration-500 hover:scale-[1.03] shadow-xl shadow-amber-500/10"
              >
                {content.cta.contact}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          <p className="text-[11px] text-slate-600 leading-relaxed text-center max-w-2xl mx-auto">
            {content.legalNote}
          </p>
        </div>
      </div>
    </main>
  )
}
