"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Lightbulb, FileText, Calendar, Settings, Music, CheckCircle, ArrowRight } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n-provider"
import { useLang } from "@/hooks/use-lang"
import { useRouter } from "next/navigation"

export default function TimelineSection() {
  const { t } = useI18n()
  const lang = useLang()
  const router = useRouter()

  const timelineSteps = [
    {
      icon: MessageCircle,
      title: t("timeline.steps.consultation.title"),
      description: t("timeline.steps.consultation.description"),
      duration: t("timeline.steps.consultation.duration"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Lightbulb,
      title: t("timeline.steps.conception.title"),
      description: t("timeline.steps.conception.description"),
      duration: t("timeline.steps.conception.duration"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: t("timeline.steps.devis.title"),
      description: t("timeline.steps.devis.description"),
      duration: t("timeline.steps.devis.duration"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Calendar,
      title: t("timeline.steps.planning.title"),
      description: t("timeline.steps.planning.description"),
      duration: t("timeline.steps.planning.duration"),
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Music,
      title: t("timeline.steps.production.title"),
      description: t("timeline.steps.production.description"),
      duration: t("timeline.steps.production.duration"),
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Settings,
      title: t("timeline.steps.technical.title"),
      description: t("timeline.steps.technical.description"),
      duration: t("timeline.steps.technical.duration"),
      color: "from-teal-500 to-blue-500",
    },
    {
      icon: CheckCircle,
      title: t("timeline.steps.event.title"),
      description: t("timeline.steps.event.description"),
      duration: t("timeline.steps.event.duration"),
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("timeline.title")}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              {t("timeline.highlight")}
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {t("timeline.description")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 transform md:-translate-x-0.5"></div>

          {timelineSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`relative flex items-center mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              {/* Timeline dot */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform md:-translate-x-2 z-10"></div>

              {/* Content card */}
              <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}>
                <motion.div whileHover={{ scale: 1.02, y: -5 }} className="group">
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <step.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-bold text-lg">{step.title}</h3>
                            <span className="text-purple-400 text-sm font-medium">{step.duration}</span>
                          </div>
                          <p className="text-white/80">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Arrow for desktop */}
              <div
                className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 ${index % 2 === 0 ? "translate-x-6" : "-translate-x-6"
                  }`}
              >
                <ArrowRight className={`w-6 h-6 text-purple-400 ${index % 2 === 0 ? "" : "rotate-180"}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">{t("timeline.cta.title")}</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              {t("timeline.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/${lang}/contacts`)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2 inline" />
                {t("timeline.cta.consultation")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/${lang}/devis`)}
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-all duration-300"
              >
                <FileText className="w-5 h-5 mr-2 inline" />
                {t("timeline.cta.devis")}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
