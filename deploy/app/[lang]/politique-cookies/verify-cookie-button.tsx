"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/i18n-provider"

export default function VerifyCookieButton() {
    const { t } = useI18n()

    return (
        <Button
            onClick={() => window.openCookiePreferences?.()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
        >
            {t("cookies.customize") || "Gérer mes préférences"}
        </Button>
    )
}
