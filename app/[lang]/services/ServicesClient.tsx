"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import type { ServiceItem } from "@/data/services"
import { motion } from "framer-motion"
import { useI18n } from "@/components/i18n/i18n-provider"
import { SplitTitle } from "@/components/ui/split-title"

interface ServicesClientProps {
  servicesList: ServiceItem[]
  lang: string
  pageConfig?: {
    title: string;
    subtitle?: string;
    showBadge?: boolean;
    badgeText?: string;
  }
}

export default function ServicesClient({ servicesList, lang, pageConfig }: ServicesClientProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orb orb-orange animate-orb opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orb orb-blue animate-orb opacity-30" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-orb orb-white animate-orb opacity-20" />

      <div className="container mx-auto px-4 py-32 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          {pageConfig?.showBadge && pageConfig?.badgeText && (
            <Badge className="mb-6 bg-white/5 border-white/10 text-amber-500 px-4 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              {pageConfig.badgeText}
            </Badge>
          )}

          {pageConfig?.title ? (
            <h1 
              className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
              dangerouslySetInnerHTML={{ __html: pageConfig.title }} 
            />
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              <SplitTitle text="Nos Services" />
            </h1>
          )}

          {pageConfig?.subtitle && (
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {pageConfig.subtitle}
            </p>
          )}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {servicesList.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Card className="rounded-[2.5rem] overflow-hidden group transition-all duration-500 h-[450px] md:h-[500px] relative flex flex-col justify-end border-0 shadow-2xl">
                {/* Background Full Cover Image */}
                <div className="absolute inset-0 z-0 bg-[#0A0A16]">
                  {service.image && !service.image.includes("placeholder") ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full sunset-gradient flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80">
                      <Sparkles className="w-16 h-16 text-black/40" />
                    </div>
                  )}
                  {/* Dark gradient overlay so text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-[#020617]/80 to-transparent z-10 transition-opacity duration-300" />
                </div>

                {/* Content over image */}
                <CardHeader className="relative z-20 p-8 pb-4">
                  <CardTitle className="text-3xl md:text-4xl font-bold mb-3 transition-colors duration-300 drop-shadow-lg">
                    <SplitTitle text={service.title} />
                  </CardTitle>
                  <p className="text-slate-300 text-base md:text-lg leading-relaxed line-clamp-2 drop-shadow-md">
                    {service.description}
                  </p>
                </CardHeader>
                
                <CardContent className="relative z-20 p-8 pt-0 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features?.slice(0,3).map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-white/10 border-white/20 text-white px-3 py-1 rounded-lg backdrop-blur-md group-hover:bg-amber-500/30 group-hover:border-amber-500/50 group-hover:text-amber-100 transition-all duration-300 text-xs md:text-sm font-medium"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-auto border-t border-white/10 pt-6">
                    <Link href={`/${lang}/services/${service.id}`} className="block">
                      <Button className="w-full bg-white/5 hover:bg-amber-500 hover:text-black border border-white/20 text-white font-bold h-14 rounded-2xl transition-all duration-300 backdrop-blur-xl shadow-xl group-hover:shadow-amber-500/20 group-hover:scale-[1.02]">
                        {t("common.learnMore") || "En savoir plus"}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Contact */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mt-32"
        >
          <div className="glassy-card rounded-[3rem] p-12 md:p-16 border border-white/10 relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 blur-[100px] pointer-events-none" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Vous avez un projet ?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Contactez-nous pour discuter de votre vision et transformer votre événement en un moment d'exception.
            </p>
            <Link href={`/${lang}/devis`}>
              <Button
                size="lg"
                className="sunset-gradient hover:opacity-90 text-black font-extrabold px-12 h-16 rounded-2xl shadow-[0_20px_50px_-20px_rgba(217,119,6,0.5)] transition-all duration-500 hover:scale-105"
              >
                Parlons-en !
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
