"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Images } from "lucide-react"
import { toast } from "sonner"
import ImageUpload from "./image-upload"

export default function HeroCarouselManager() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const response = await fetch("/api/hero-carousel")
        if (!response.ok) throw new Error("Failed to fetch carousel data")
        const data = await response.json()
        if (data.images) {
          setImages(data.images)
        }
      } catch (error) {
        console.error("Error fetching carousel:", error)
        toast.error("Erreur lors de la récupération du carrousel")
      } finally {
        setLoading(false)
      }
    }

    fetchCarousel()
  }, [])

  const handleSave = async () => {
    if (images.length === 0) {
      toast.error("Veuillez ajouter au moins une image.")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/hero-carousel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement")
      }

      toast.success("Carrousel sauvegardé avec succès")
    } catch (error) {
      console.error(error)
      toast.error("Une erreur est survenue lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white mb-2">Gestion du Carrousel Accueil</h2>
          <p className="text-white/60 text-sm max-w-2xl">
            Ajoutez, supprimez, ordonnez ou recadrez les images grand format pour le bandeau principal d'accueil.
            Privilégiez les images de haute qualité et en format paysage (16:9).
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer le carrousel
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader className="border-b border-white/10 bg-white/5">
            <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
              <Images className="w-5 h-5 text-purple-400" />
              Diapositives du carrousel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-slate-950/50 p-6 rounded-xl border border-white/5">
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={50}
                label="Photos du carrousel"
                cropAspect={16 / 9}
              />
            </div>
            
            {images.length > 0 && (
              <div className="mt-8">
                <h4 className="text-white/80 font-medium mb-4 text-sm uppercase tracking-wider">Aperçu Visuel (Ken Burns & Fondu)</h4>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                  {images.map((img, idx) => (
                    <motion.div
                      key={img}
                      className="absolute inset-0 w-full h-full"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ 
                        opacity: idx === 0 ? 1 : 0,
                        scale: idx === 0 ? 1.05 : 1
                      }}
                      transition={{ 
                        opacity: { duration: 1 },
                        scale: { duration: 10, ease: "linear" }
                      }}
                    >
                      <img src={img} className="object-cover w-full h-full" alt="slide preview" />
                      {/* Subtitle/Slogan representation */}
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-8 z-10">
                        <div className="w-3/4 max-w-xl">
                          <h2 className="text-3xl font-display font-bold text-white mb-2 drop-shadow-lg">Votre partenaire technique pour la Captation, le Streaming et le Podcast</h2>
                          <div className="flex gap-4 mt-6 justify-center">
                            <div className="h-10 w-32 bg-amber-500 rounded-xl" />
                            <div className="h-10 w-32 bg-white/20 rounded-xl" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-3 text-center italic">Ceci est un aperçu statique de la première diapositive.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
