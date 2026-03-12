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
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
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
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-800/20 backdrop-blur-md rounded-2xl border border-slate-700 space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
        <h3 className="text-2xl font-bold text-white">Réclamation envoyée</h3>
        <p className="text-slate-300 max-w-md mx-auto">
          Nous avons bien reçu votre demande de réclamation portant le numéro <strong className="text-emerald-400">{reclamationNumber}</strong>.<br/><br/>
          Un accusé de réception vous a été envoyé par e-mail. Nous la traiterons dans les plus brefs délais.
        </p>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsSuccess(false)
            form.reset()
            setCaptchaToken(null)
          }}
          className="mt-6 border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white"
        >
          Nouvelle demande
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prénom */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Prénom <span className="text-red-400">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Votre prénom" 
                    {...field} 
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500" 
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
                <FormLabel className="text-white">Nom <span className="text-red-400">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Votre nom" 
                    {...field} 
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500" 
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
                <FormLabel className="text-white">Email <span className="text-red-400">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="votre@email.com" 
                    type="email" 
                    {...field} 
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500" 
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
                <FormLabel className="text-white">Téléphone (Optionnel)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="06 00 00 00 00" 
                    type="tel" 
                    {...field} 
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500" 
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
                <FormLabel className="text-white">Sujet de la réclamation <span className="text-red-400">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Problème concernant mon événement ou billet..." 
                    {...field} 
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500" 
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
                <FormLabel className="text-white">Message détaillé <span className="text-red-400">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Décrivez votre problème avec le plus de détails possibles pour nous aider à le résoudre." 
                    className="min-h-[150px] bg-white/5 border-white/10 text-white focus-visible:ring-purple-500 resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Consentement RGPD */}
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md border-white/10 bg-white/5">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1 border-slate-300 bg-white/10 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 data-[state=checked]:text-white"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium text-slate-100 cursor-pointer">
                  J'accepte la politique de confidentialité
                </FormLabel>
                <p className="text-xs text-slate-400 leading-relaxed">
                  En cochant cette case, j'accepte que les informations saisies soient exploitées dans le cadre strict 
                  du traitement de ma réclamation selon <a href={`/${lang}/politique-confidentialite`} className="text-purple-400 hover:text-purple-300 underline">la politique de confidentialité</a>.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cloudflare Turnstile CAPTCHA */}
        <div className="flex justify-center my-6">
          <TurnstileWidget onVerify={setCaptchaToken} />
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          disabled={isSubmitting || !captchaToken} 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Soumettre la réclamation"
          )}
        </Button>
      </form>
    </Form>
  )
}
