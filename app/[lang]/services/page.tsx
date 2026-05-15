import { notFound } from "next/navigation"
import { Redis } from "@upstash/redis"
import ServicesClient from "./ServicesClient"
import { defaultServices, type ServiceItem } from "@/data/services"

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

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params
  
  if (!resolvedParams.lang || !["fr", "en", "es"].includes(resolvedParams.lang)) {
    notFound()
  }

  const rawServices = await getServices()
  // Ultimate safety filter to replicate existing API behavior 
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

  return <ServicesClient servicesList={servicesList} lang={resolvedParams.lang} pageConfig={pageConfig} />
}
