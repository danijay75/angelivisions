"use client"

import { useMemo, useState } from "react"
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

export default function DpdContactForm() {
    const { t } = useI18n()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const formSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(2, { message: t("legalForms.dpd.validation.name") }),
                email: z.string().email({ message: t("legalForms.dpd.validation.email") }),
                requestType: z
                    .string()
                    .min(1, { message: t("legalForms.dpd.validation.requestType") }),
                message: z.string().min(10, { message: t("legalForms.dpd.validation.message") }),
            }),
        [t],
    )

    type FormValues = z.infer<typeof formSchema>

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            requestType: "",
            message: "",
        },
    })

    async function onSubmit(values: FormValues) {
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
                throw new Error(data.error || t("legalForms.dpd.error"))
            }

            toast.success(t("legalForms.dpd.success"), {
                description: t("legalForms.dpd.successDesc"),
                duration: 5000,
            })
            form.reset()
        } catch (error: any) {
            console.error("DPD Form Error:", error)
            if (error.name === 'AbortError') {
                toast.error(t("legalForms.dpd.timeout"), {
                    description: t("legalForms.dpd.timeoutDesc")
                })
            } else {
                toast.error(error.message || t("legalForms.dpd.error"), {
                    description: t("legalForms.dpd.errorDesc")
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
                                <FormLabel className="text-slate-300">{t("legalForms.dpd.name")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("legalForms.dpd.namePlaceholder")}
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
                                <FormLabel className="text-slate-300">{t("legalForms.dpd.email")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("legalForms.dpd.emailPlaceholder")}
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
                            <FormLabel className="text-slate-300">{t("legalForms.dpd.requestType")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-amber-500/50 transition-all">
                                        <SelectValue placeholder={t("legalForms.dpd.requestTypePlaceholder")} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                    <SelectItem value="access">{t("legalForms.dpd.requestTypes.access")}</SelectItem>
                                    <SelectItem value="rectification">{t("legalForms.dpd.requestTypes.rectification")}</SelectItem>
                                    <SelectItem value="deletion">{t("legalForms.dpd.requestTypes.deletion")}</SelectItem>
                                    <SelectItem value="portability">{t("legalForms.dpd.requestTypes.portability")}</SelectItem>
                                    <SelectItem value="opposition">{t("legalForms.dpd.requestTypes.opposition")}</SelectItem>
                                    <SelectItem value="other">{t("legalForms.dpd.requestTypes.other")}</SelectItem>
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
                            <FormLabel className="text-slate-300">{t("legalForms.dpd.message")}</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={t("legalForms.dpd.messagePlaceholder")}
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
                            {t("legalForms.dpd.sending")}
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            {t("legalForms.dpd.submit")}
                        </>
                    )}
                </Button>
                <p className="text-center text-slate-500 text-sm italic">
                    {t("legalForms.dpd.footnote")}
                </p>
            </form>
        </Form>
    )
}
