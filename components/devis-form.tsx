"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Users, MapPin, Music, Mic, Zap, Camera, Send, CheckCircle, Monitor } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n-provider"

export default function DevisForm() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    eventType: "",
    services: [] as string[],
    eventDate: "",
    guestCount: "",
    budget: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const eventTypes = [
    { id: "wedding", label: t("devis.eventTypes.wedding"), icon: "💒" },
    { id: "corporate", label: t("devis.eventTypes.corporate"), icon: "🏢" },
    { id: "private", label: t("devis.eventTypes.private"), icon: "🎉" },
    { id: "festival", label: t("devis.eventTypes.festival"), icon: "🎵" },
    { id: "other", label: t("devis.eventTypes.other"), icon: "✨" },
  ]

  const services = [
    { id: "dj", label: t("devis.services.dj"), icon: Mic, color: "from-purple-500 to-pink-500" },
    { id: "production", label: t("devis.services.production"), icon: Music, color: "from-blue-500 to-cyan-500" },
    { id: "organization", label: t("devis.services.organization"), icon: Calendar, color: "from-green-500 to-emerald-500" },
    { id: "technical", label: t("devis.services.technical"), icon: Zap, color: "from-orange-500 to-red-500" },
    { id: "led-walls", label: t("devis.services.ledWalls"), icon: Monitor, color: "from-violet-500 to-purple-500" },
    { id: "mapping", label: t("devis.services.mapping"), icon: Camera, color: "from-indigo-500 to-purple-500" },
    { id: "media", label: t("devis.services.media"), icon: Camera, color: "from-pink-500 to-rose-500" },
  ]

  const budgetRanges = [
    { id: "1000-5000", label: "1 000€ - 5 000€" },
    { id: "5000-10000", label: "5 000€ - 10 000€" },
    { id: "10000-25000", label: "10 000€ - 25 000€" },
    { id: "25000+", label: "25 000€+" },
    { id: "discuss", label: t("devis.budgetDiscuss") },
  ]

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <section id="devis" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">{t("devis.success.title")}</h3>
                <p className="text-white/80 mb-6">
                  {t("devis.success.message")}
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {t("devis.success.newRequest")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="devis" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("devis.title")}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              {t("devis.highlight")}
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {t("devis.description")}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">{t("devis.formTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Event Type */}
                <div>
                  <Label className="text-white text-lg mb-4 block">{t("devis.eventType")}</Label>
                  <RadioGroup
                    value={formData.eventType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, eventType: value }))}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {eventTypes.map((type) => (
                      <motion.div key={type.id} whileHover={{ scale: 1.02 }} className="relative">
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <Label
                          htmlFor={type.id}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.eventType === type.id
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}
                        >
                          <span className="text-2xl mr-3">{type.icon}</span>
                          <span className="text-white">{type.label}</span>
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Services */}
                <div>
                  <Label className="text-white text-lg mb-4 block">
                    {t("devis.servicesTitle")}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <motion.div key={service.id} whileHover={{ scale: 1.02 }} className="relative">
                        <div
                          onClick={() => handleServiceToggle(service.id)}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.services.includes(service.id)
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mr-3`}
                          >
                            <service.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white">{service.label}</span>
                          <Checkbox checked={formData.services.includes(service.id)} className="ml-auto" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="eventDate" className="text-white mb-2 block">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {t("devis.date")}
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, eventDate: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestCount" className="text-white mb-2 block">
                      <Users className="w-4 h-4 inline mr-2" />
                      {t("devis.guests")}
                    </Label>
                    <Input
                      id="guestCount"
                      placeholder="ex: 150"
                      value={formData.guestCount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, guestCount: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-white mb-2 block">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      {t("devis.location")}
                    </Label>
                    <Input
                      id="location"
                      placeholder="ex: Paris"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <Label className="text-white text-lg mb-4 block">{t("devis.budget")}</Label>
                  <RadioGroup
                    value={formData.budget}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {budgetRanges.map((range) => (
                      <motion.div key={range.id} whileHover={{ scale: 1.02 }} className="relative">
                        <RadioGroupItem value={range.id} id={range.id} className="sr-only" />
                        <Label
                          htmlFor={range.id}
                          className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.budget === range.id
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}
                        >
                          <span className="text-white text-center">{range.label}</span>
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block">
                      {t("devis.name")}
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">
                      {t("devis.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white mb-2 block">
                      {t("devis.phone")}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-white mb-2 block">
                      {t("devis.company")}
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-white mb-2 block">
                    {t("devis.projectDescription")}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t("devis.placeholder")}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                  />
                </div>

                {/* Submit */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-full text-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {t("devis.submit")}
                  </Button>
                  <p className="text-white/60 text-sm mt-4">
                    {t("devis.guarantee")}
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
