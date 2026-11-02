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

const BASE_URL = "https://angelivisions.com"
const DONATION_URL = "https://www.paypal.com/donate/?hosted_button_id=WZBCQXPEHHDDC"
const VERSION = "1.1.1"

type FaqItem = { question: string; answer: string }

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

function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "#fonctionnalites", label: "Fonctionnalités" },
    { href: "#fonctionnement", label: "Comment ça marche" },
    { href: "#telechargements", label: "Téléchargements" },
    { href: "#faq", label: "FAQ" },
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
            alt="Icône Easy IP-Switch"
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
          <a
            href="#don"
            className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[13px] font-medium text-slate-300 transition hover:border-amber-400/30 hover:text-amber-200 sm:inline-flex"
          >
            <Heart className="h-3.5 w-3.5" />
            Soutenir
          </a>
          <a
            href="#telechargements"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-slate-950 shadow-lg shadow-black/30 transition hover:bg-blue-100 sm:px-4 sm:text-[13px]"
          >
            <Download className="h-3.5 w-3.5" />
            Télécharger
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

function AppMock() {
  return (
    <div
      className="relative mx-auto w-full max-w-[520px]"
      role="img"
      aria-label="Aperçu de l'interface d'Easy IP-Switch : une carte Ethernet avec le choix DHCP ou adresse fixe, les champs adresse IP, masque et passerelle, le bouton de test et le bouton Changer."
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
            <span className="ml-2 text-[10px] font-medium text-slate-400">Easy IP-Switch</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Administrateur
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-white/[0.06] px-4 pt-3">
          <span className="border-b-2 border-blue-400 px-3 pb-2.5 text-[11px] font-semibold text-white">
            Cartes réseau
          </span>
          <span className="px-3 pb-2.5 text-[11px] font-medium text-slate-500">Test de ping</span>
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
                Connecté
              </span>
            </div>

            {/* DHCP / static segmented control */}
            <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/40 p-1 text-[10px] font-medium">
              <span className="rounded-lg px-3 py-1.5 text-center text-slate-500">DHCP</span>
              <span className="rounded-lg bg-white/[0.11] px-3 py-1.5 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                Adresse fixe
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <MockField label="Adresse IP" value="192.168.1.50" />
              <div className="grid grid-cols-2 gap-2">
                <MockField label="Masque" value="255.255.255.0" />
                <MockField label="Passerelle" value="192.168.1.1" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[9px] font-semibold text-slate-300">
                Tester
              </span>
              <span className="rounded-lg px-3 py-1.5 text-[9px] font-medium text-slate-500">
                Annuler
              </span>
              <span className="ml-auto rounded-lg bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-1.5 text-[9px] font-semibold text-white shadow-lg shadow-blue-500/30">
                Changer
              </span>
            </div>

            <p className="mt-2.5 flex items-center gap-1.5 text-[9px] text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              Adresse et passerelle joignables (3 ms).
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
                  <p className="text-[11px] font-semibold text-white">Wi-Fi</p>
                  <p className="text-[9px] text-slate-500">Intel(R) Wi-Fi 6 AX201</p>
                </div>
              </div>
              <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-sky-300">
                DHCP
              </span>
            </div>
            <p className="mt-2 font-mono text-[9px] text-slate-500">
              192.168.1.24 · adresse fixe enregistrée : 192.168.1.50
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-[9px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" />
            Actualisation automatique
          </span>
          <span className="flex items-center gap-1.5">
            <Power className="h-3 w-3" />
            Carte active
          </span>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const reduceMotion = useReducedMotion()

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
                Nouveau · Version {VERSION}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-medium text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Gratuit et sans inscription
              </span>
            </div>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">
              Easy IP-Switch
            </p>

            <h1 className="mt-4 font-display text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[2.9rem] lg:text-[3.35rem] xl:text-[3.7rem]">
              L’application{" "}
              <span className="whitespace-nowrap bg-gradient-to-r from-blue-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Tout-en-un
              </span>{" "}
              pour changer facilement et rapidement d’adresse IP
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
              Easy IP-Switch réunit le changement d’adresse, la validation des champs et le test de
              connexion dans une interface unique. Fini les clics dans les menus réseau de Windows
              ou de macOS : tout se fait en quelques secondes.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#telechargements"
                className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl bg-gradient-to-r from-blue-500 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_-12px_rgba(59,130,246,0.9)] transition duration-300 hover:-translate-y-0.5 hover:from-blue-400 hover:to-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                <Download className="h-4 w-4 transition group-hover:translate-y-0.5" />
                Télécharger gratuitement
              </a>
              <a
                href="#fonctionnalites"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slate-200 backdrop-blur transition duration-300 hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
              >
                Découvrir les fonctionnalités
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Windows 8, 10 et 11
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                macOS Intel et Apple Silicon
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Aucune installation requise
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { y: 34, scale: 0.97 }}
            animate={reduceMotion ? undefined : { y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <AppMock />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ArrowLeftRight,
    title: "DHCP ou adresse fixe",
    description:
      "Basculez d’une attribution automatique à une adresse fixe — et inversement — d’un clic, sans redémarrer ni passer par les menus système.",
  },
  {
    icon: Network,
    title: "Adresse, masque, passerelle",
    description:
      "Les trois valeurs essentielles dans un seul formulaire, avec validation immédiate du format, du masque contigu et du sous-réseau.",
  },
  {
    icon: Gauge,
    title: "Test de connectivité",
    description:
      "Vérifiez que l’adresse de la carte et sa passerelle répondent réellement, avec le temps de réponse en millisecondes.",
  },
  {
    icon: Layers,
    title: "Toutes vos cartes réseau",
    description:
      "Ethernet, Wi-Fi et interfaces virtuelles réunies sur un même écran, avec leur état, leur adresse actuelle et les changements en attente.",
  },
  {
    icon: Timer,
    title: "Onglet Test de ping",
    description:
      "Pingez n’importe quelle cible depuis la carte réseau de votre choix, sans ouvrir de terminal ni mémoriser de commande.",
  },
  {
    icon: Zap,
    title: "Léger et portable",
    description:
      "Un seul exécutable de moins de 200 Ko, aucune installation, aucune télémétrie. Thème clair et sombre au choix.",
  },
]

const highlights: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ShieldCheck,
    title: "Détection des droits",
    description: "L’application indique si elle dispose bien des droits administrateur.",
  },
  {
    icon: Settings2,
    title: "Connexions réseau",
    description: "Ouvre le panneau Windows et crée un raccourci sur le Bureau.",
  },
  {
    icon: CheckCircle2,
    title: "Adresse fixe mémorisée",
    description: "Windows conserve votre dernière adresse fixe même sous DHCP.",
  },
  {
    icon: Power,
    title: "Activation des cartes",
    description: "Activez ou désactivez une interface sans quitter l’application.",
  },
]

function Features() {
  return (
    <section
      id="fonctionnalites"
      className="relative scroll-mt-24 border-t border-white/[0.06] py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Fonctionnalités"
            title={
              <>
                Un seul outil,{" "}
                <span className="title-gradient">tout votre réseau</span>
              </>
            }
            description="Conçu pour aller vite : chaque action essentielle tient sur un écran, sans plonger dans les paramètres de Windows ou de macOS."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
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
          {highlights.map((item, index) => {
            const Icon = item.icon
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

const steps = [
  {
    title: "Lancez l’application",
    description:
      "Sur Windows, acceptez la demande d’élévation. Sur macOS, l’application s’ouvre immédiatement ; l’autorisation sera demandée au moment du changement.",
  },
  {
    title: "Choisissez la carte",
    description:
      "Sélectionnez Ethernet, Wi-Fi ou toute autre interface. Son état et son adresse IPv4 actuelle s’affichent automatiquement.",
  },
  {
    title: "Changez et testez",
    description:
      "Passez en DHCP ou saisissez une adresse fixe, cliquez sur « Changer », puis sur « Tester » pour vérifier la connexion.",
  },
]

function HowItWorks() {
  return (
    <section id="fonctionnement" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="En trois étapes"
            title={
              <>
                De l’ouverture à la nouvelle adresse,{" "}
                <span className="title-gradient">en quelques secondes</span>
              </>
            }
            description="Aucun script, aucun terminal, aucun redémarrage : une interface claire qui montre toujours l’état réel de vos cartes."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
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
              <span className="font-semibold text-white">Bon à savoir :</span> les modifications non
              appliquées sont proposées à la fermeture. Vous pouvez tout appliquer d’un coup, quitter
              sans rien changer ou rester dans l’application.
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
  size: string
  format: string
  bullets: string[]
  cta: string
  recommended: boolean
}

function Downloads({ detectedOs }: { detectedOs: DetectedOs }) {
  const downloads: DownloadItem[] = [
    {
      id: "windows",
      title: "Windows",
      subtitle: "PC et tablettes",
      icon: Monitor,
      compatibility: "Windows 8, 10 et 11",
      file: `/downloads/easy-ip-switch/easy-ip-switch-${VERSION}-windows.exe`,
      size: "180 Ko",
      format: ".exe",
      bullets: [
        "Windows 8, 10 et 11",
        "Aucune installation, exécutable portable",
        "Droits administrateur requis",
      ],
      cta: "Télécharger pour Windows",
      recommended: detectedOs === "windows",
    },
    {
      id: "mac-intel",
      title: "macOS Intel",
      subtitle: "Mac à processeur Intel",
      icon: Apple,
      compatibility: "macOS 12 (Monterey) ou plus récent",
      file: `/downloads/easy-ip-switch/easy-ip-switch-${VERSION}-macos-intel.dmg`,
      size: "1,1 Mo",
      format: ".dmg",
      bullets: [
        "Mac avec processeur Intel",
        "macOS 12 ou plus récent",
        "Installation par glisser-déposer",
      ],
      cta: "Télécharger pour Intel",
      recommended: false,
    },
    {
      id: "mac-arm",
      title: "macOS Apple Silicon",
      subtitle: "Mac avec puce Apple",
      icon: Apple,
      compatibility: "macOS 12 ou plus récent",
      file: `/downloads/easy-ip-switch/easy-ip-switch-${VERSION}-macos-apple-silicon.dmg`,
      size: "1,1 Mo",
      format: ".dmg",
      bullets: [
        "Mac avec puce M1, M2, M3 ou M4",
        "macOS 12 ou plus récent",
        "Installation par glisser-déposer",
      ],
      cta: "Télécharger pour Apple Silicon",
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
            eyebrow="Téléchargements"
            title={
              <>
                Choisissez <span className="title-gradient">votre version</span>
              </>
            }
            description={`Version ${VERSION} · Gratuit · Windows 8, 10 et 11 · macOS 12 ou plus récent. Le même contenu, sur tous vos appareils.`}
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
                      Recommandé pour votre appareil
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
                    {item.size} · version {VERSION} · gratuit
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>

        {detectedOs === "mac" ? (
          <Reveal delay={0.1}>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
              <Apple className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-[13px] leading-relaxed text-slate-300">
                <span className="font-semibold text-white">Vous êtes sur Mac.</span> Ouvrez le menu
                Apple → « À propos de ce Mac » : si la ligne « Puce » indique Apple M1, M2, M3, M4 ou
                plus récent, choisissez Apple Silicon. Si la ligne « Processeur » mentionne Intel,
                choisissez la version Intel.
              </p>
            </div>
          </Reveal>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Reveal>
            <details className="group h-full rounded-2xl border border-white/[0.08] bg-black/20 p-5 transition open:border-white/15 open:bg-black/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2.5">
                  <Monitor className="h-4 w-4 text-blue-400" />
                  Installer sur Windows
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500 transition duration-300 group-open:rotate-180" />
              </summary>
              <ol className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-slate-400">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  Téléchargez le fichier <span className="font-mono text-[12px] text-slate-300">.exe</span>.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  Si SmartScreen s’affiche : « Informations complémentaires », puis « Exécuter quand
                  même ».
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  Acceptez la demande d’élévation : elle est nécessaire pour modifier une carte
                  réseau.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  Aucune installation : le fichier peut rester sur le Bureau, dans un dossier ou sur
                  une clé USB.
                </li>
              </ol>
            </details>
          </Reveal>

          <Reveal delay={0.05}>
            <details className="group h-full rounded-2xl border border-white/[0.08] bg-black/20 p-5 transition open:border-white/15 open:bg-black/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2.5">
                  <Apple className="h-4 w-4 text-amber-300" />
                  Installer sur macOS
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500 transition duration-300 group-open:rotate-180" />
              </summary>
              <ol className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-slate-400">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
                  Téléchargez le <span className="font-mono text-[12px] text-slate-300">.dmg</span>{" "}
                  correspondant à votre puce.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
                  Ouvrez le DMG, puis glissez Easy IP-Switch dans le dossier Applications.
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
                  Au premier lancement, si macOS bloque l’application : clic droit sur l’icône →
                  « Ouvrir ».
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
                  macOS 15 et plus récent : autorisez l’accès au réseau local pour le test de ping.
                </li>
              </ol>
            </details>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Donation() {
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
                  Soutenir le projet
                </span>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-4xl">
                  Soutenir <span className="text-amber-300">Easy IP-Switch</span>
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
                  L’application est développée bénévolement et distribuée gratuitement, sans
                  publicité ni version payante. Un don aide à couvrir les frais de développement, de
                  signature et d’hébergement — et à financer les prochaines versions.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={DONATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_16px_50px_-12px_rgba(251,191,36,0.8)] transition duration-300 hover:-translate-y-0.5 hover:from-amber-200 hover:to-amber-400"
                  >
                    <Heart className="h-4 w-4" />
                    Faire un don via PayPal
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                  <a
                    href="#telechargements"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-white/12 bg-black/20 px-6 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                    Retour aux téléchargements
                  </a>
                </div>

                <p className="mt-4 text-[11.5px] text-slate-500">
                  Paiement sécurisé par PayPal · Carte bancaire acceptée · Don ponctuel ou récurrent
                </p>
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
                      alt="QR code pour faire un don PayPal à Easy IP-Switch"
                      width={480}
                      height={480}
                      unoptimized
                      className="h-[150px] w-[150px]"
                    />
                  </div>
                  <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-white">
                    <Heart className="h-3.5 w-3.5 text-amber-300" />
                    Scannez avec votre téléphone
                  </p>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    ou cliquez pour ouvrir la page PayPal
                  </p>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" className="relative scroll-mt-24 border-t border-white/[0.06] py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Les questions <span className="title-gradient">les plus fréquentes</span>
              </>
            }
            description="Une autre question ? Écrivez-nous à contact@angelivisions.com."
          />
        </Reveal>

        <div className="mt-10 space-y-3">
          {items.map((item, index) => (
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

function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#04070f]/60 py-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/images/easy-ip-switch/icon.png"
                alt="Icône Easy IP-Switch"
                width={40}
                height={40}
                className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/15"
              />
              <div>
                <p className="font-display text-sm font-semibold text-white">Easy IP-Switch</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Un outil Angeli Visions · v{VERSION}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
              L’application Tout-en-un pour changer facilement et rapidement d’adresse IP, sous
              Windows 8, 10, 11 et macOS.
            </p>
          </div>

          <div className="grid gap-7 text-[12.5px] sm:grid-cols-3 sm:gap-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Application
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#fonctionnalites" className="text-slate-400 transition hover:text-white">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#telechargements" className="text-slate-400 transition hover:text-white">
                    Téléchargements
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-slate-400 transition hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Angeli Visions
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href={BASE_URL} className="text-slate-400 transition hover:text-white">
                    Le site
                  </a>
                </li>
                <li>
                  <a
                    href={`${BASE_URL}/fr/mentions-legales`}
                    className="text-slate-400 transition hover:text-white"
                  >
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a
                    href={`${BASE_URL}/fr/politique-confidentialite`}
                    className="text-slate-400 transition hover:text-white"
                  >
                    Confidentialité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Contact & don
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
                    Faire un don
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Angeli Visions. Tous droits réservés.</p>
          <p>Easy IP-Switch est distribué gratuitement, sans garantie d’aucune sorte.</p>
        </div>
      </div>
    </footer>
  )
}

export default function EasyIpSwitchLanding({ faq }: { faq: FaqItem[] }) {
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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Downloads detectedOs={detectedOs} />
        <Donation />
        <Faq items={faq} />
      </main>
      <Footer />
    </div>
  )
}
