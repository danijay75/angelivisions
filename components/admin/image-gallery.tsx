"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Image as ImageIcon, Upload, Trash2, Loader2, LinkIcon, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ImageGalleryProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  label?: string
}

export default function ImageGallery({ images = [], onImagesChange, maxImages = 20, label = "Galerie" }: ImageGalleryProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlValue, setUrlValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddUrl = () => {
    const trimmed = urlValue.trim()
    if (!trimmed) return
    
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images atteint`)
      return
    }

    onImagesChange([...images, trimmed])
    setUrlValue("")
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Erreur lors de l'upload")
        return null
      }

      const data = await res.json()
      return data.url
    } catch (e) {
      alert("Erreur de connexion lors de l'upload")
      return null
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      alert("Veuillez sélectionner uniquement des fichiers image (.jpg, .png, .webp...)")
      return
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`)
      return
    }

    setUploading(true)

    const uploadedUrls: string[] = []
    for (const file of imageFiles) {
      const url = await uploadFile(file)
      if (url) uploadedUrls.push(url)
    }

    if (uploadedUrls.length > 0) {
      onImagesChange([...images, ...uploadedUrls])
    }
    
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-white/90">
        <label className="font-semibold text-sm tracking-wide uppercase">{label}</label>
        <span className="text-white/40 text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          {images.length} / {maxImages} MAX
        </span>
      </div>

      <Card
        className={`group relative overflow-hidden border-2 border-dashed transition-all duration-500 cursor-pointer ${
          isDragging
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-10 text-center relative z-10">
          <motion.div animate={{ scale: isDragging ? 1.05 : 1 }} transition={{ duration: 0.2 }} className="space-y-4">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-white/20">
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-white" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-white font-bold text-lg">
                {uploading ? "Transfert en cours..." : "Téléchargez vos images"}
              </h3>
              <p className="text-white/40 text-sm max-w-xs mx-auto">
                Faites glisser vos fichiers ou <span className="text-emerald-400 hover:text-emerald-300 font-medium">parcourez</span>
              </p>
            </div>
            
            <div className="text-[10px] font-bold text-white/30 tracking-widest px-2 py-0.5 mt-2 inline-block rounded border border-white/5 bg-white/5 uppercase">
              Max 10 Mo par image
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none group-focus-within:text-emerald-400 transition-colors duration-300">
            <LinkIcon className="w-4 h-4 text-white/40" />
          </div>
          <Input
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="Ou collez l'URL d'une image"
            className="pl-10 bg-white/5 border-white/10 text-white h-11 rounded-xl focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all duration-300"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddUrl()
              }
            }}
          />
        </div>
        <Button
          type="button"
          onClick={handleAddUrl}
          variant="outline"
          className="h-11 px-6 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 font-medium"
        >
          Ajouter
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={maxImages > 1}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
          <AnimatePresence mode="popLayout">
            {images.map((image, index) => (
              <motion.div
                key={image + index}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="relative group h-32"
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                       // Fallback si l'URL ne veut pas charger pour x raison
                       const target = e.target as HTMLImageElement;
                       target.style.display = "none";
                       target.parentElement?.classList.add("flex", "items-center", "justify-center");
                       target.parentElement?.insertAdjacentHTML('beforeend', '<div class="flex flex-col items-center opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="text-[10px] mt-2">Erreur chargement</span></div>');
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      size="icon"
                      variant="destructive"
                      className="bg-red-500/80 hover:bg-red-500 text-white rounded-xl w-10 h-10 border border-red-400/20 backdrop-blur-md"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <a
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-xl w-10 h-10 border border-white/20 backdrop-blur-md flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
