import EasyIpSwitchLanding from "./easy-ip-switch-landing"
import { landingContent } from "./content"
import { buildJsonLd, buildMetadata } from "./seo"

export const metadata = buildMetadata("fr")

export default function EasyIpSwitchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd("fr")) }}
      />
      <EasyIpSwitchLanding locale="fr" content={landingContent.fr} />
    </>
  )
}
