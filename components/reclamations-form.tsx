"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, CheckCircle2, Send } from "lucide-react"
import TurnstileWidget from "@/components/ui/turnstile"

// A schema adjusted for Reclamations
const reclamationFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit au moins contenir 2 caractères"),
  lastName: z.string().min(2, "Le nom doit au moins contenir 2 caractères"),
  email: z.string().email("L'adresse email est invalide"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Le sujet doit au moins contenir 5 caractères"),
  message: z.string().min(20, "Le message de réclamation doit être détaillé (minimum 20 caractères)"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la politique de confidentialité.",
  }),
})

type ReclamationFormValues = z.infer<typeof reclamationFormSchema>

export default function ReclamationsForm({ lang }: { lang: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [reclamationNumber, setReclamationNumber] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<ReclamationFormValues>({
    resolver: zodResolver(reclamationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      consent: false,
    },
  })

  async function onSubmit(data: ReclamationFormValues) {
    if (!captchaToken) {
      toast({
        title: "Validation requise",
        description: "Veuillez valider le captcha avant d'envoyer votre réclamation.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        ...data,
        captchaToken,
      }

      const response = await fetch("/api/reclamations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Une erreur est survenue lors de l'envoi de votre réclamation.")
      }

      setIsSuccess(true)
      setReclamationNumber(result.number)
      
      toast({
        title: "Réclamation envoyée",
        description: `Votre dossier porte la référence ${result.number}. Un e-mail de confirmation vous a été envoyé.`,
      })
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitError(error instanceof Error ? error.message : "Une erreur inattendue est survenue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center glassy-card rounded-[2.5rem] border border-white/10 space-y-6">
        <div className="w-20 h-20 sunset-gradient rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_-5px_rgba(251,191,36,0.5)]">
          <CheckCircle2 className="w-10 h-10 text-black" />
        </div>
        <h3 className="text-3xl font-bold text-white tracking-tight">Réclamation envoyée</h3>
        <p className="text-slate-300 text-lg max-w-md mx-auto leading-relaxed">
          Nous avons bien reçu votre demande de réclamation portant le numéro <strong className="text-amber-500">{reclamationNumber}</strong>.<br/><br/>
          Un accusé de réception vous a été envoyé par e-mail. Nous la traiterons dans les plus brefs délais.
        </p>
        <Button 
          onClick={() => {
            setIsSuccess(false)
            form.reset()
            setCaptchaToken(null)
          }}
          className="mt-8 sunset-gradient text-black font-bold h-12 px-10 rounded-xl transition-all duration-300 shadow-lg hover:opacity-90"
        >
          Nouvelle demande
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {submitError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prénom */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 ml-1">Prénom <span className="text-amber-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Votre prénom" 
                    {...field} 
                    className="bg-white/[0.03] border-white/10 text-white rounded-xl h-12 focus-visible:ring-amber-500/50 backdrop-blur-sm transition-all" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 ml-1">Nom <span className="text-amber-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Votre nom" 
                    {...field} 
                    className="bg-white/[0.03] border-white/10 text-white rounded-xl h-12 focus-visible:ring-amber-500/50 backdrop-blur-sm transition-all" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 ml-1">Email <span className="text-amber-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="votre@email.com" 
                    type="email" 
                    {...field} 
                    className="bg-white/[0.03] border-white/10 text-white rounded-xl h-12 focus-visible:ring-amber-500/50 backdrop-blur-sm transition-all" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone (Optionnel) */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 ml-1">Téléphone (Optionnel)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="06 00 00 00 00" 
                    type="tel" 
                    {...field} 
                    className="bg-white/[0.03] border-white/10 text-white rounded-xl h-12 focus-visible:ring-amber-500/50 backdrop-blur-sm transition-all" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sujet de la réclamation */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-slate-300 ml-1">Sujet <span className="text-amber-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Problème concernant mon événement ou billet..." 
                    {...field} 
                    className="bg-white/[0.03] border-white/10 text-white rounded-xl h-12 focus-visible:ring-amber-500/50 backdrop-blur-sm transition-all" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message détaillé */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-slate-300 ml-1">Message détaillé <span className="text-amber-500">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Décrivez votre problème avec le plus de détails possibles..." 
                    className="min-h-[150px] bg-white/[0.03] border-white/10 text-white rounded-2xl focus-visible:ring-amber-500/50 backdrop-blur-sm transition-all p-4 resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Consentement RGPD Simplifié */}
        <div className="p-6 glassy-card rounded-2xl border border-white/5 transition-all hover:border-white/20 select-none">
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              required
              {...form.register("consent")}
              className="mt-1 w-5 h-5 accent-amber-500 cursor-pointer"
            />
            <div className="flex flex-col gap-1">
              <label 
                htmlFor="consent" 
                className="text-sm font-medium text-slate-200 cursor-pointer hover:text-amber-500 transition-colors"
              >
                J'accepte la politique de confidentialité
              </label>
              <p className="text-xs text-slate-500 leading-relaxed">
                En cochant cette case, j'accepte que les informations saisies soient exploitées dans le cadre du traitement de ma réclamation selon <a href={`/${lang}/politique-confidentialite`} className="text-amber-500 font-bold underline hover:text-amber-400 transition-colors" target="_blank" rel="noopener noreferrer">la politique de confidentialité</a>.
              </p>
              {form.formState.errors.consent && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.consent.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cloudflare Turnstile CAPTCHA */}
        <div className="flex justify-center my-8">
          <TurnstileWidget onVerify={setCaptchaToken} theme="dark" />
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          disabled={isSubmitting || !captchaToken} 
          className="w-full sunset-gradient text-black font-bold h-16 text-lg rounded-2xl shadow-xl shadow-amber-500/10 transition-all duration-500 hover:scale-[1.01] hover:opacity-95 disabled:opacity-30 disabled:grayscale"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 mr-3 animate-spin border-black/30 border-t-black rounded-full" />
              Envoi en cours...
            </div>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Soumettre la réclamation
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
