import { redirect } from "next/navigation"

export default async function LocalizedEsideCultureRedirect({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    redirect(`/${lang}/eside-culture-blog`)
}
