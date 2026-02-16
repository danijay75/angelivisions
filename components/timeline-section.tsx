"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Lightbulb, FileText, Calendar, Settings, Music, CheckCircle, ArrowRight } from "lucide-react"

export default function TimelineSection() {
  const timelineSteps = [
    {
      icon: MessageCircle,
      title: "Consultation Initiale",
      description: "Échange sur vos besoins, budget et vision de l'événement",
      duration: "30 min",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Lightbulb,
      title: "Conception Créative",
      description: "Élaboration du concept artistique et technique personnalisé",
      duration: "2-3 jours",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "Devis Détaillé",
      description: "Proposition complète avec timeline et budget transparent",
      duration: "24-48h",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Calendar,
      title: "Planification",
      description: "Organisation logistique : venue, prestataires, planning détaillé",
      duration: "1-4 semaines",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Music,
      title: "Production Musicale",
      description: "Création des compositions sur-mesure et préparation technique",
      duration: "1-3 semaines",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Settings,
      title: "Installation Technique",
      description: "Mise en place du matériel, tests et répétitions",
      duration: "Jour J-1",
      color: "from-teal-500 to-blue-500",
    },
    {
      icon: CheckCircle,
      title: "Événement & Suivi",
      description: "Animation live, régie technique et coordination complète",
      duration: "Jour J",
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
            Notre Processus
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Votre Partenaire Privilégié
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            De l'idée à la réalisation, nous vous accompagnons à chaque étape pour créer des événements culturels
            exceptionnels et mémorables.
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
                className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 ${
                  index % 2 === 0 ? "translate-x-6" : "-translate-x-6"
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
            <h3 className="text-2xl font-bold text-white mb-4">Prêt à créer votre événement sur-mesure ?</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour une consultation gratuite et découvrez comment nous pouvons
              transformer votre vision en réalité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2 inline" />
                Consultation gratuite
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-all duration-300"
              >
                <FileText className="w-5 h-5 mr-2 inline" />
                Devis express
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
