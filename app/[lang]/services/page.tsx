import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Redis } from "@upstash/redis"
import ServicesClient from "./ServicesClient"
import { defaultServices, type ServiceItem } from "@/data/services"
import { LOCALES, isLocale } from "@/lib/i18n/locales"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

const META: Record<"fr" | "en" | "es", { title: string; description: string }> = {
  fr: {
    title: "Nos Services",
    description:
      "Production musicale, organisation d'événements, murs LED, mapping vidéo et captation média. Tous nos services événementiels.",
  },
  en: {
    title: "Our Services",
    description:
      "Music production, event organization, LED walls, video mapping and media capture. All our event services.",
  },
  es: {
    title: "Nuestros Servicios",
    description:
      "Producción musical, organización de eventos, pantallas LED, video mapping y captura de medios. Todos nuestros servicios.",
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}

  const meta = META[lang]
  const languages: Record<string, string> = {}
  LOCALES.forEach((l) => {
    languages[l] = `${BASE_URL}/${l}/services`
  })
  languages["x-default"] = `${BASE_URL}/fr/services`

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${lang}/services`,
      languages,
    },
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getServices(): Promise<ServiceItem[]> {
  const fallbackServices = defaultServices

  try {

    const redis = new Redis({
      url: process.env.KV_REST_API_URL || "",
      token: process.env.KV_REST_API_TOKEN || "",
    })
    
    const SERVICES_KEY = "av_services_v1"
    const servicesData = await redis.get(SERVICES_KEY)
    
    if (servicesData) {
      if (typeof servicesData === "string") {
        return JSON.parse(servicesData)
      } else if (typeof servicesData === "object" && Array.isArray(servicesData)) {
        return servicesData
      }
    }
  } catch (error) {
    console.error("Failed to fetch services layout, using fallback.", error)
  }
  
  return fallbackServices
}

async function getProjects(): Promise<any[]> {
  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL || "",
      token: process.env.KV_REST_API_TOKEN || "",
    })
    
    const projectsData = await redis.get("projects")
    
    if (projectsData) {
      if (typeof projectsData === "string") {
        return JSON.parse(projectsData)
      } else if (typeof projectsData === "object" && Array.isArray(projectsData)) {
        return projectsData
      }
    }
  } catch (error) {
    console.error("Failed to fetch projects for services page.", error)
  }
  
  return []
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params
  
  if (!resolvedParams.lang || !["fr", "en", "es"].includes(resolvedParams.lang)) {
    notFound()
  }

  const [rawServices, projects] = await Promise.all([
    getServices(),
    getProjects()
  ])
  
  const servicesList = rawServices
  
  let pageConfig = {
    title: "Nos <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-500\">Services</span>",
    subtitle: "",
    showBadge: false,
    badgeText: "Notre expertise"
  }
  
  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL || "",
      token: process.env.KV_REST_API_TOKEN || "",
    })
    const configData = await redis.get("av_services_config_v1")
    if (configData) {
      if (typeof configData === "string") {
        pageConfig = JSON.parse(configData)
      } else if (typeof configData === "object") {
        pageConfig = configData as any
      }
    }
  } catch (err) {
    console.error("Failed to fetch page config", err)
  }

  return <ServicesClient servicesList={servicesList} lang={resolvedParams.lang} projects={projects} pageConfig={pageConfig} />
}
