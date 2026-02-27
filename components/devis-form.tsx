"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Users, MapPin, Music, Mic, Zap, Camera, Send, CheckCircle, Monitor, Home } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/components/i18n/i18n-provider"
import Turnstile from "@/components/ui/turnstile"
import { captchaBypass } from "@/lib/public-config"

export default function DevisForm() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    eventType: "",
    services: [] as string[],
    eventDate: "",
    guestCount: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
    consent: false,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(captchaBypass ? "bypass" : null)

  const eventTypes = useMemo(() => [
    { id: "corporate", label: t("devis.eventTypes.corporate"), icon: "🏢" },
    { id: "private", label: t("devis.eventTypes.private"), icon: "🎉" },
    { id: "festival", label: t("devis.eventTypes.festival"), icon: "🎵" },
    { id: "other", label: t("devis.eventTypes.other"), icon: "✨" },
  ], [t])

  const services = useMemo(() => [
    { id: "dj", label: t("devis.services.dj"), icon: Mic, color: "from-blue-600 to-cyan-600" },
    { id: "production", label: t("devis.services.production"), icon: Music, color: "from-blue-500 to-cyan-500" },
    { id: "organization", label: t("devis.services.organization"), icon: Calendar, color: "from-green-500 to-emerald-500" },
    { id: "technical", label: t("devis.services.technical"), icon: Zap, color: "from-orange-500 to-red-500" },
    { id: "led-walls", label: t("devis.services.ledWalls"), icon: Monitor, color: "from-blue-500 to-cyan-500" },
    { id: "mapping", label: t("devis.services.mapping"), icon: Camera, color: "from-blue-700 to-cyan-700" },
    { id: "media", label: t("devis.services.media"), icon: Camera, color: "from-cyan-600 to-blue-800" },
  ], [t])


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [id]: val }))
  }, [])

  const handleValueChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleServiceToggle = useCallback((serviceId: string) => {
    setFormData((prev) => {
      const currentServices = Array.isArray(prev.services) ? prev.services : []
      return {
        ...prev,
        services: currentServices.includes(serviceId)
          ? currentServices.filter((s) => s !== serviceId)
          : [...currentServices, serviceId],
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, captchaToken }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.message || t("devis.error"))
        return
      }
      setIsSubmitted(true)
    } catch {
      setError(t("devis.error"))
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="devis" className="py-20 bg-slate-950">
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
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-2 rounded-full transition-all duration-300"
                >
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    {t("common.backToHome")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="devis" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("devis.title")}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
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
                    onValueChange={(value: string) => handleValueChange("eventType", value)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {eventTypes.map((type) => (
                      <motion.div key={type.id} whileHover={{ scale: 1.02 }} className="relative">
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <Label
                          htmlFor={type.id}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.eventType === type.id
                            ? "border-blue-500 bg-blue-500/20"
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
                    {services.map((service) => {
                      const isSelected = Array.isArray(formData.services) && formData.services.includes(service.id)
                      return (
                        <motion.div key={service.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <label
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected
                              ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                              : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                              }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mr-4 shadow-lg`}
                            >
                              <service.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-medium">{service.label}</span>
                            </div>
                            <div className="ml-auto">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-blue-500 border-blue-500" : "border-white/20"
                                }`}>
                                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                              </div>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={isSelected}
                                onChange={() => handleServiceToggle(service.id)}
                              />
                            </div>
                          </label>
                        </motion.div>
                      )
                    })}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
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
                      onChange={handleInputChange}
                      placeholder={t("footer.newsletterName")}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                  />
                </div>

                {/* RGPD Consent */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-1 accent-blue-500 min-w-[16px]"
                    required
                  />
                  <span className="text-sm text-white/70 leading-relaxed">
                    {t("devis.consent")}
                  </span>
                </label>

                {/* Turnstile Captcha */}
                {!captchaBypass && (
                  <div className="flex justify-center py-6 border-t border-white/10 mt-8">
                    <Turnstile
                      onVerify={setCaptchaToken}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => {
                        console.error("Turnstile error encountered")
                        setCaptchaToken(null)
                      }}
                      theme="dark"
                    />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-center">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <motion.div whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || !formData.consent || !captchaToken}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-4 rounded-full text-lg disabled:opacity-50"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? t("devis.sending") : t("devis.submit")}
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
