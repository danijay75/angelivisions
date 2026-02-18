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
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/contact/dpd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Une erreur est survenue")
            }

            toast.success("Votre demande a bien été envoyée au DPD.")
            form.reset()
        } catch (error) {
            console.error("DPD Form Error:", error)
            toast.error("Erreur lors de l'envoi de la demande. Veuillez réessayer.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Nom complet</FormLabel>
                            <FormControl>
                                <Input placeholder="Votre nom" className="bg-slate-800 border-slate-700 text-white" {...field} />
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
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="votre@email.com" className="bg-slate-800 border-slate-700 text-white" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="requestType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Type de demande</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Sélectionnez un sujet" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="access">Droit d'accès</SelectItem>
                                    <SelectItem value="rectification">Rectification</SelectItem>
                                    <SelectItem value="deletion">Suppression (Droit à l'oubli)</SelectItem>
                                    <SelectItem value="portability">Portabilité</SelectItem>
                                    <SelectItem value="other">Autre demande</SelectItem>
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
                            <FormLabel className="text-white">Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Détaillez votre demande..."
                                    className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
                </Button>
            </form>
        </Form>
    )
}
