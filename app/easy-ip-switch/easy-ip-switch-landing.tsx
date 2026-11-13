"use client"

import { useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import {
  Apple,
  ArrowLeftRight,
  ArrowRight,
  Cable,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  Gauge,
  Globe,
  Heart,
  Layers,
  Monitor,
  Network,
  Power,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Timer,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react"
import type { LandingContent } from "./content"
import release from "./release.json"
import {
  LOCALE_LABELS,
  LOCALE_NAMES,
  PAGE_LOCALES,
  localePath,
  type PageLocale,
} from "./locales"

const BASE_URL = "https://angelivisions.com"
const DONATION_URL = "https://www.paypal.com/donate/?hosted_button_id=WZBCQXPEHHDDC"
const VERSION = release.windowsVersion
const MAC_VERSION = release.macVersion
const WINDOWS_SHA256 = release.windowsSha256
const WINDOWS_ZIP_URL = `https://github.com/danijay75/easy-ip-switch/releases/download/v${VERSION}/easy-ip-switch-${VERSION}-windows.zip`
const WINDOWS_CHECKSUMS_URL = "/downloads/easy-ip-switch/SHA256SUMS.txt"
const GITHUB_RELEASE_URL = `https://github.com/danijay75/easy-ip-switch/releases/tag/v${VERSION}`

type DetectedOs = "windows" | "mac" | "other" | null

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { y: 22 }}
      animate={reduceMotion ? undefined : { y: 0 }}
      transition={{ duration: 0.55, delay: Math.min(delay, 0.3), ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: ReactNode
  description?: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300">
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function FlagIcon({ locale }: { locale: PageLocale }) {
  return (
    <Image
      src={`/images/easy-ip-switch/flags/${locale}.png`}
      alt=""
      width={40}
      height={27}
      unoptimized
      aria-hidden="true"
      className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-black/40"
    />
  )
}

function LanguageSwitcher({
  locale,
  label,
}: {
  locale: PageLocale
  label: string
}) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-[12px] font-medium text-slate-300 transition hover:border-white/25 hover:text-white [&::-webkit-details-marker]:hidden">
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">{label}</span>
        <span className="uppercase">{LOCALE_LABELS[locale]}</span>
        <ChevronDown className="h-3 w-3 text-slate-500 transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#070c16]/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl">
        {PAGE_LOCALES.map((item) => (
          <a
            key={item}
            href={localePath(item)}
            hrefLang={item}
            lang={item}
            aria-current={item === locale ? "page" : undefined}
            className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-[13px] transition ${
              item === locale
                ? "bg-blue-500/10 text-white"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FlagIcon locale={item} />
              <span>{LOCALE_NAMES[item]}</span>
            </span>
            {item === locale ? <Check className="h-3.5 w-3.5 text-blue-400" /> : null}
          </a>
        ))}
      </div>
    </details>
  )
}

function Header({ locale, content }: { locale: PageLocale; content: LandingContent }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "#fonctionnalites", label: content.nav.features },
    { href: "#fonctionnement", label: content.nav.how },
    { href: "#telechargements", label: content.nav.downloads },
    { href: "#faq", label: content.nav.faq },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.07] bg-[#04070f]/85 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a href="#accueil" className="group flex shrink-0 items-center gap-2.5 md:gap-3">
          <Image
            src="/images/easy-ip-switch/icon.png"
            alt="Easy IP-Switch"
            width={44}
            height={44}
            priority
            className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-blue-500/30 ring-1 ring-white/15 md:h-11 md:w-11"
          />
          <span className="flex flex-col leading-none">
            <span className="whitespace-nowrap font-display text-[15px] font-semibold tracking-tight text-white md:text-[17px]">
              Easy IP-Switch
            </span>
            <span className="mt-1 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.18em] text-blue-300/80 md:text-[10px]">
              v{VERSION}
              <span className="hidden sm:inline"> · Angeli Visions</span>
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={content.nav.language} />
          <a
            href="#don"
            className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-slate-300 transition hover:border-amber-400/30 hover:text-amber-200 sm:inline-flex"
          >
            <Heart className="h-3.5 w-3.5" />
            {content.nav.support}
          </a>
          <a
            href="#telechargements"
            className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-slate-950 shadow-lg shadow-black/30 transition hover:bg-blue-100 sm:inline-flex sm:px-4 sm:text-[13px]"
          >
            <Download className="h-3.5 w-3.5" />
            {content.nav.download}
          </a>
        </div>
      </div>
    </header>
  )
}

function MockField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
      <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-0.5 font-mono text-[10px] text-slate-200">{value}</p>
    </div>
  )
}

function AppMock({ content }: { content: LandingContent }) {
  const mock = content.mock

  return (
    <div
      className="relative mx-auto w-full max-w-[520px]"
      role="img"
      aria-label={mock.aria}
    >
      <div
        className="absolute -inset-8 rounded-[3rem] bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="absolute inset-x-10 -bottom-6 h-16 rounded-full bg-sky-400/20 blur-2xl" aria-hidden="true" />

      <div className="relative overflow-hidden rounded-[1.6rem] border border-white/12 bg-[#070c16]/95 shadow-[0_35px_90px_-25px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
        {/* Window title bar */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[10px] font-medium text-slate-400">{mock.title}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {mock.admin}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-white/[0.06] px-4 pt-3">
          <span className="border-b-2 border-blue-400 px-3 pb-2.5 text-[11px] font-semibold text-white">
            {mock.tabs.adapters}
          </span>
          <span className="px-3 pb-2.5 text-[11px] font-medium text-slate-500">{mock.tabs.ping}</span>
        </div>

        <div className="space-y-3 p-4">
          {/* Main adapter card */}
          <div className="rounded-2xl border border-blue-400/25 bg-gradient-to-b from-blue-500/[0.08] to-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/15 text-blue-300">
                  <Cable className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-white">Ethernet</p>
                  <p className="text-[9px] text-slate-500">Realtek PCIe GbE Family Controller</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 pt-0.5 text-[9px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                {mock.connected}
              </span>
            </div>

            {/* DHCP / static segmented control */}
            <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/40 p-1 text-[10px] font-medium">
              <span className="rounded-lg px-3 py-1.5 text-center text-slate-500">{mock.dhcp}</span>
              <span className="rounded-lg bg-white/[0.11] px-3 py-1.5 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                {mock.static}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <MockField label={mock.fields.ip} value="192.168.1.50" />
              <div className="grid grid-cols-2 gap-2">
                <MockField label={mock.fields.mask} value="255.255.255.0" />
                <MockField label={mock.fields.gateway} value="192.168.1.1" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[9px] font-semibold text-slate-300">
                {mock.test}
              </span>
              <span className="rounded-lg px-3 py-1.5 text-[9px] font-medium text-slate-500">
                {mock.cancel}
              </span>
              <span className="ml-auto rounded-lg bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-1.5 text-[9px] font-semibold text-white shadow-lg shadow-blue-500/30">
                {mock.apply}
              </span>
            </div>

            <p className="mt-2.5 flex items-center gap-1.5 text-[9px] text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              {mock.success}
            </p>
          </div>

          {/* Secondary adapter card */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                  <Wifi className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-white">{mock.wifi}</p>
                  <p className="text-[9px] text-slate-500">Intel(R) Wi-Fi 6 AX201</p>
                </div>
              </div>
              <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-sky-300">
                {mock.dhcp}
              </span>
            </div>
            <p className="mt-2 font-mono text-[9px] text-slate-500">
              192.168.1.24 · {mock.savedStatic}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-[9px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" />
            {mock.autoRefresh}
          </span>
          <span className="flex items-center gap-1.5">
            <Power className="h-3 w-3" />
            {mock.adapterActive}
          </span>
        </div>
      </div>
    </div>
  )
}

function Hero({ content }: { content: LandingContent }) {
  const reduceMotion = useReducedMotion()
  const hero = content.hero

  return (
    <section id="accueil" className="relative overflow-hidden pb-20 pt-28 sm:pt-32 md:pb-28 md:pt-40">
      <div
        className="pointer-events-none absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-24 h-[26rem] w-[26rem] rounded-full bg-sky-500/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div
            initial={reduceMotion ? false : { y: 26 }}
            animate={reduceMotion ? undefined : { y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-200">
                <Zap className="h-3 w-3" />
                {hero.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-medium text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {hero.free}
              </span>
            </div>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">
              {hero.kicker}
            </p>

            <h1 className="mt-4 font-display text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[2.9rem] lg:text-[3.35rem] xl:text-[3.7rem]">
              {hero.title.pre}
              <span className="whitespace-nowrap bg-gradient-to-r from-blue-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                {hero.title.accent}
              </span>
              {hero.title.post}
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
              {hero.description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#telechargements"
                className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl bg-gradient-to-r from-blue-500 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_-12px_rgba(59,130,246,0.9)] transition duration-300 hover:-translate-y-0.5 hover:from-blue-400 hover:to-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                <Download className="h-4 w-4 transition group-hover:translate-y-0.5" />
                {hero.ctaDownload}
              </a>
              <a
                href="#fonctionnalites"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slate-200 backdrop-blur transition duration-300 hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
              >
                {hero.ctaFeatures}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12px] text-slate-500">
              {hero.meta.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-2.5">
                  {index > 0 ? (
                    <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
                  ) : null}
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { y: 34, scale: 0.97 }}
            animate={reduceMotion ? undefined : { y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <AppMock content={content} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const featureIcons: LucideIcon[] = [ArrowLeftRight, Network, Gauge, Layers, Timer, Zap]
const highlightIcons: LucideIcon[] = [ShieldCheck, Settings2, CheckCircle2, Power]

function Features({ content }: { content: LandingContent }) {
  const features = content.features

  return (
    <section
      id="fonctionnalites"
      className="relative scroll-mt-24 border-t border-white/[0.06] py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={features.eyebrow}
            title={
              <>
                {features.title.pre}
                <span className="title-gradient">{features.title.accent}</span>
              </>
            }
            description={features.description}
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((feature, index) => {
            const Icon = featureIcons[index] ?? Zap
            return (
              <Reveal key={feature.title} delay={index * 0.05}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:from-blue-500/[0.09] hover:to-white/[0.02]">
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/20 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-blue-500/10 text-blue-300 transition duration-300 group-hover:border-blue-400/30 group-hover:text-blue-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-5 font-display text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.highlights.map((item, index) => {
            const Icon = highlightIcons[index] ?? CheckCircle2
            return (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-slate-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-200">{item.title}</p>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks({ content }: { content: LandingContent }) {
  const steps = content.steps

  return (
    <section id="fonctionnement" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={steps.eyebrow}
            title={
              <>
                {steps.title.pre}
                <span className="title-gradient">{steps.title.accent}</span>
                {steps.title.post}
              </>
            }
            description={steps.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.items.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <div className="relative h-full rounded-3xl border border-white/[0.07] bg-white/[0.025] p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 font-display text-sm font-bold text-white shadow-lg shadow-blue-500/30">
                    {index + 1}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-blue-400/15 bg-blue-500/[0.06] p-5 sm:flex-row sm:items-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <p className="text-[13px] leading-relaxed text-slate-300">
              <span className="font-semibold text-white">{steps.noteLabel}</span> {steps.note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

type DownloadItem = {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  compatibility: string
  file: string
  version: string
  size: string
  format: string
  bullets: string[]
  cta: string
  zipCta?: string
  zipHint?: string
  recommended: boolean
}

function Downloads({
  content,
  detectedOs,
}: {
  content: LandingContent
  detectedOs: DetectedOs
}) {
  const downloadsContent = content.downloads
  const warning = downloadsContent.windowsWarning

  const downloads: DownloadItem[] = [
    {
      id: "windows",
      ...downloadsContent.windows,
      icon: Monitor,
      file: `/downloads/easy-ip-switch/easy-ip-switch-${VERSION}-windows.exe`,
      version: VERSION,
      size: downloadsContent.sizeWindows,
      format: ".exe",
      recommended: detectedOs === "windows",
    },
    {
      id: "mac-intel",
      ...downloadsContent.macIntel,
      icon: Apple,
      file: `/downloads/easy-ip-switch/easy-ip-switch-${MAC_VERSION}-macos-intel.dmg`,
      version: MAC_VERSION,
      size: downloadsContent.sizeMac,
      format: ".dmg",
      recommended: false,
    },
    {
      id: "mac-arm",
      ...downloadsContent.macArm,
      icon: Apple,
      file: `/downloads/easy-ip-switch/easy-ip-switch-${MAC_VERSION}-macos-apple-silicon.dmg`,
      version: MAC_VERSION,
      size: downloadsContent.sizeMac,
      format: ".dmg",
      recommended: false,
    },
  ]

  return (
    <section
      id="telechargements"
      className="relative scroll-mt-24 border-y border-white/[0.06] bg-white/[0.012] py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[24rem] w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={downloadsContent.eyebrow}
            title={
              <>
                {downloadsContent.title.pre}
                <span className="title-gradient">{downloadsContent.title.accent}</span>
              </>
            }
            description={downloadsContent.description}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {downloads.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal key={item.id} delay={index * 0.07}>
                <article
                  className={`relative flex h-full flex-col rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 ${
                    item.recommended
                      ? "border-blue-400/40 bg-gradient-to-b from-blue-500/[0.12] to-white/[0.02] shadow-[0_20px_60px_-25px_rgba(59,130,246,0.7)]"
                      : "border-white/[0.08] bg-white/[0.025] hover:border-white/15"
                  }`}
                >
                  {item.recommended ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-blue-500/40">
                      {downloadsContent.recommended}
                    </span>
                  ) : null}

                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                      {item.format}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-400">{item.subtitle}</p>
                  <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 text-[10.5px] font-medium text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    {item.compatibility}
                  </p>

                  <ul className="mt-5 space-y-2 text-[12.5px] text-slate-400">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={item.file}
                    download
                    className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
                      item.recommended
                        ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/30 hover:from-blue-400 hover:to-sky-400"
                        : "border border-white/12 bg-white/[0.05] text-white hover:border-blue-400/40 hover:bg-blue-500/10"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    {item.cta}
                  </a>
                  <p className="mt-2.5 text-center text-[10.5px] text-slate-500">
                    {item.size} · version {item.version} · {downloadsContent.freeLabel}
                  </p>
                  {item.zipCta ? (
                    <>
                      <a
                        href={WINDOWS_ZIP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-[13px] font-semibold text-white transition duration-300 hover:border-amber-300/40 hover:bg-amber-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                      >
                        <Download className="h-4 w-4" />
                        {item.zipCta}
                      </a>
                      {item.zipHint ? (
                        <p className="mt-2 text-center text-[10.5px] leading-relaxed text-slate-500">
                          {item.zipHint}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-6 overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.1] via-white/[0.03] to-transparent p-6 md:p-7">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                {warning.eyebrow}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-white sm:text-2xl">
                {warning.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
                {warning.description}
              </p>

              <ol className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-slate-300">
                {warning.steps.map((step, index) => (
                  <li key={step} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-[10px] font-bold text-amber-200">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {warning.hashLabel}
                </p>
                <code className="mt-1.5 block break-all font-mono text-[11px] leading-relaxed text-slate-300">
                  {WINDOWS_SHA256}
                </code>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <a
                  href={WINDOWS_ZIP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-4 py-2.5 text-[12px] font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-200 hover:to-amber-400"
                >
                  <Download className="h-3.5 w-3.5" />
                  {warning.zipCta}
                </a>
                <a
                  href={WINDOWS_CHECKSUMS_URL}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:border-amber-300/40 hover:bg-amber-400/10"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {warning.checksumsCta}
                </a>
                <a
                  href={GITHUB_RELEASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:border-amber-300/40 hover:bg-amber-400/10"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {warning.githubCta}
                </a>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{warning.note}</p>
            </div>
          </div>
        </Reveal>

        {detectedOs === "mac" ? (
          <Reveal delay={0.1}>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
              <Apple className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-[13px] leading-relaxed text-slate-300">{downloadsContent.macNotice}</p>
            </div>
          </Reveal>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[downloadsContent.installWin, downloadsContent.installMac].map((install, index) => (
            <Reveal key={install.title} delay={index * 0.05}>
              <details className="group h-full rounded-2xl border border-white/[0.08] bg-black/20 p-5 transition open:border-white/15 open:bg-black/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2.5">
                    {index === 0 ? (
                      <Monitor className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Apple className="h-4 w-4 text-amber-300" />
                    )}
                    {install.title}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500 transition duration-300 group-open:rotate-180" />
                </summary>
                <ol className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-slate-400">
                  {install.steps.map((step) => (
                    <li key={step} className="flex gap-2.5">
                      <span
                        className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                          index === 0 ? "bg-blue-400" : "bg-amber-300"
                        }`}
                      />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Donation({ content }: { content: LandingContent }) {
  const donation = content.donation

  return (
    <section id="don" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.14] via-white/[0.03] to-transparent p-6 md:p-10">
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">
                  <Heart className="h-3 w-3" />
                  {donation.eyebrow}
                </span>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-4xl">
                  {donation.titlePre}
                  <span className="whitespace-nowrap text-amber-300">{donation.titleAccent}</span>
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
                  {donation.description}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={DONATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_16px_50px_-12px_rgba(251,191,36,0.8)] transition duration-300 hover:-translate-y-0.5 hover:from-amber-200 hover:to-amber-400"
                  >
                    <Heart className="h-4 w-4" />
                    {donation.cta}
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                  <a
                    href="#telechargements"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-white/12 bg-black/20 px-6 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                    {donation.back}
                  </a>
                </div>

                <p className="mt-4 text-[11.5px] text-slate-500">{donation.note}</p>
              </div>

              <div className="mx-auto w-full max-w-[300px]">
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center transition hover:border-amber-300/30 hover:bg-white/[0.06]"
                >
                  <div className="mx-auto w-fit rounded-2xl bg-white p-3 shadow-xl shadow-black/30">
                    <Image
                      src="/images/easy-ip-switch/donation-qr.png"
                      alt={donation.qrAlt}
                      width={480}
                      height={480}
                      unoptimized
                      className="h-[150px] w-[150px]"
                    />
                  </div>
                  <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-white">
                    <Heart className="h-3.5 w-3.5 text-amber-300" />
                    {donation.qrTitle}
                  </p>
                  <p className="mt-1.5 text-[11px] text-slate-500">{donation.qrHint}</p>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Faq({ content }: { content: LandingContent }) {
  const faq = content.faq

  return (
    <section id="faq" className="relative scroll-mt-24 border-t border-white/[0.06] py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={faq.eyebrow}
            title={
              <>
                {faq.title.pre}
                <span className="title-gradient">{faq.title.accent}</span>
              </>
            }
            description={faq.description}
          />
        </Reveal>

        <div className="mt-10 space-y-3">
          {faq.items.map((item, index) => (
            <Reveal key={item.question} delay={index * 0.03}>
              <details className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 transition open:border-blue-400/25 open:bg-blue-500/[0.04]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-slate-100 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition duration-300 group-open:rotate-180 group-open:text-blue-300" />
                </summary>
                <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({ locale, content }: { locale: PageLocale; content: LandingContent }) {
  const footer = content.footer

  return (
    <footer className="border-t border-white/[0.07] bg-[#04070f]/60 py-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/images/easy-ip-switch/icon.png"
                alt="Easy IP-Switch"
                width={40}
                height={40}
                className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/15"
              />
              <div>
                <p className="font-display text-sm font-semibold text-white">Easy IP-Switch</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{footer.tagline}</p>
              </div>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-slate-500">{footer.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {PAGE_LOCALES.map((item) => (
                <a
                  key={item}
                  href={localePath(item)}
                  hrefLang={item}
                  lang={item}
                  aria-current={item === locale ? "page" : undefined}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                    item === locale
                      ? "bg-blue-500/15 text-blue-200"
                      : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                  }`}
                >
                  {LOCALE_LABELS[item]}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-7 text-[12.5px] sm:grid-cols-3 sm:gap-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {footer.appColumn}
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#fonctionnalites" className="text-slate-400 transition hover:text-white">
                    {content.nav.features}
                  </a>
                </li>
                <li>
                  <a href="#telechargements" className="text-slate-400 transition hover:text-white">
                    {content.nav.downloads}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-slate-400 transition hover:text-white">
                    {content.nav.faq}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {footer.siteColumn}
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href={BASE_URL} className="text-slate-400 transition hover:text-white">
                    {footer.site}
                  </a>
                </li>
                <li>
                  <a
                    href={`${BASE_URL}/fr/mentions-legales`}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {footer.legal}
                  </a>
                </li>
                <li>
                  <a
                    href={`${BASE_URL}/fr/politique-confidentialite`}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {footer.privacy}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {footer.contactColumn}
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="mailto:contact@angelivisions.com"
                    className="text-slate-400 transition hover:text-white"
                  >
                    contact@angelivisions.com
                  </a>
                </li>
                <li>
                  <a
                    href={DONATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-amber-300/90 transition hover:text-amber-200"
                  >
                    <Heart className="h-3 w-3" />
                    {footer.donate}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Angeli Visions. {footer.rights}
          </p>
          <p>{footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}

export default function EasyIpSwitchLanding({
  locale,
  content,
}: {
  locale: PageLocale
  content: LandingContent
}) {
  const [detectedOs, setDetectedOs] = useState<DetectedOs>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    if (/Windows/i.test(ua)) {
      setDetectedOs("windows")
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      setDetectedOs("mac")
    } else {
      setDetectedOs("other")
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = content.lang
  }, [content.lang])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent">
      <Header locale={locale} content={content} />
      <main>
        <Hero content={content} />
        <Features content={content} />
        <HowItWorks content={content} />
        <Downloads content={content} detectedOs={detectedOs} />
        <Donation content={content} />
        <Faq content={content} />
      </main>
      <Footer locale={locale} content={content} />
    </div>
  )
}
