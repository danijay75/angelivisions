"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useI18n } from "@/components/i18n/i18n-provider"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
    requestType: z.string().min(1, { message: "Veuillez sélectionner un type de demande." }),
    message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
})

export default function DpdContactForm() {
    const { t } = useI18n()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            requestType: "",
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isSubmitting) return;
        
        setIsSubmitting(true)
        console.log("[DPD Form] Soumission démarrée...");
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 secondes

        try {
            const response = await fetch("/api/contact/dpd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
                signal: controller.signal
            })

            clearTimeout(timeoutId);
            
            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { error: "Erreur de réponse serveur" };
            }

            if (!response.ok) {
                throw new Error(data.error || "Une erreur est survenue lors de l'envoi")
            }

            toast.success("Votre demande a bien été envoyée. Nous reviendrons vers vous rapidement.", {
                description: "Un email a été envoyé au délégué à la protection des données.",
                duration: 5000,
            })
            form.reset()
        } catch (error: any) {
            console.error("DPD Form Error:", error)
            if (error.name === 'AbortError') {
                toast.error("Le délai d'attente a été dépassé.", {
                    description: "Le serveur met trop de temps à répondre. Veuillez réessayer."
                })
            } else {
                toast.error(error.message || "Erreur lors de l'envoi de la demande.", {
                    description: "Veuillez vérifier vos informations et réessayer."
                })
            }
        } finally {
            setIsSubmitting(false)
            console.log("[DPD Form] Soumission terminée");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300">Nom complet</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Votre nom" 
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-amber-500/50 transition-all" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300">Email professionnel</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="votre@email.com" 
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-amber-500/50 transition-all" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="requestType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-300">Type de demande RGPD</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-amber-500/50 transition-all">
                                        <SelectValue placeholder="Sélectionnez l'objet de votre demande" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                    <SelectItem value="access">Droit d'accès aux données</SelectItem>
                                    <SelectItem value="rectification">Droit de rectification</SelectItem>
                                    <SelectItem value="deletion">Droit à l'effacement (Droit à l'oubli)</SelectItem>
                                    <SelectItem value="portability">Droit à la portabilité</SelectItem>
                                    <SelectItem value="opposition">Droit d'opposition</SelectItem>
                                    <SelectItem value="other">Autre question relative aux données</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-300">Votre message détaillé</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Veuillez préciser votre demande pour un traitement optimal..."
                                    className="bg-white/5 border-white/10 text-white min-h-[150px] rounded-xl focus:border-amber-500/50 transition-all resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full h-14 bg-white text-black hover:bg-slate-200 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Envoi de la demande en cours...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Envoyer ma demande sécurisée
                        </>
                    )}
                </Button>
                <p className="text-center text-slate-500 text-sm italic">
                    Vos données sont traitées uniquement pour répondre à cette demande.
                </p>
            </form>
        </Form>
    )
}
