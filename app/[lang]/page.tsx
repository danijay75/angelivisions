import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import RealisationsSection from "@/components/realisations-section"
import ContactSection from "@/components/contact-section"
import AudioPlayer from "@/components/audio-player"
import CookieConsent from "@/components/cookie-consent"

export default function LocalizedHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section id="accueil">
        <HeroSection />
      </section>

      <section id="services" className="scroll-mt-24">
        <ServicesSection />
      </section>

      <section id="realisations" className="scroll-mt-24">
        <RealisationsSection />
      </section>

      {/* Devis section has been moved to a dedicated page at /[lang]/devis */}

      <section id="contact" className="scroll-mt-24">
        <ContactSection />
      </section>

      <AudioPlayer />
      <CookieConsent />
    </div>
  )
}
