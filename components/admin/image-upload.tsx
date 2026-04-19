"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Camera, Monitor, Trash2, Edit, Loader2 } from "lucide-react"
import ImageCropper from "./image-cropper"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  label?: string
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10, label = "Images" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<{ src: string; index: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File | Blob, originalName?: string): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append("file", file, originalName || "image.png")

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
      alert("Veuillez sélectionner uniquement des fichiers image")
      return
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`)
      return
    }

    setUploading(true)

    const uploadedUrls: string[] = []
    for (const file of imageFiles) {
      const url = await uploadFile(file, file.name)
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

  const startCropping = (src: string, index: number) => {
    setSelectedImageForCrop({ src, index })
    setCropperOpen(true)
  }

  const onCropCompleted = async (croppedBlob: Blob) => {
    setCropperOpen(false)
    if (!selectedImageForCrop) return

    setUploading(true)
    const url = await uploadFile(croppedBlob, `cropped-${Date.now()}.png`)
    
    if (url) {
      const newImages = [...images]
      newImages[selectedImageForCrop.index] = url
      onImagesChange(newImages)
    }
    
    setUploading(false)
    setSelectedImageForCrop(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-white/90">
        <label className="font-semibold text-sm tracking-wide uppercase">{label}</label>
        <span className="text-white/40 text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          {images.length} / {maxImages} MAX
        </span>
      </div>

      {/* Zone de téléchargement */}
      <Card
        className={`group relative overflow-hidden border-2 border-dashed transition-all duration-500 cursor-pointer ${
          isDragging
            ? "border-purple-500/50 bg-purple-500/5"
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
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-white/20">
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-white" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-white font-bold text-lg">
                {uploading ? "Transfert en cours..." : "Téléchargez vos fichiers"}
              </h3>
              <p className="text-white/40 text-sm max-w-xs mx-auto">
                Faites glisser vos images ici ou <span className="text-purple-400 hover:text-purple-300 font-medium">parcourez</span> vos dossiers
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              {["JPG", "PNG", "WEBP"].map((ext) => (
                <span key={ext} className="text-[10px] font-bold text-white/30 tracking-widest px-2 py-0.5 rounded border border-white/5 bg-white/5 uppercase">
                  {ext}
                </span>
              ))}
            </div>
          </motion.div>
        </CardContent>
        {/* Glow effect */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-600/10 blur-[100px] rounded-full" />
      </Card>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxImages > 1}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Prévisualisation des images */}
      {images.length > 0 && (
        <div className="space-y-4 pt-4">
          <h4 className="text-white/60 text-xs font-bold tracking-widest uppercase flex items-center">
            <ImageIcon className="w-3.5 h-3.5 mr-2 text-purple-400" />
            VOTRE SÉLECTION
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {images.map((image, index) => (
                <motion.div
                  key={image + index}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="relative group aspect-square"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-xl">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=96&width=96&text=Error"
                      }}
                    />
                    
                    {/* Overlay Control */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                      <Button
                        onClick={() => startCropping(image, index)}
                        size="icon"
                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl w-10 h-10 border border-white/20 backdrop-blur-md"
                        title="Modifier / Recadrer"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
                    </div>
                  </div>
                  <div className="mt-2 px-1 flex justify-between items-center bg-black/20 rounded-lg p-1 border border-white/5">
                    <p className="text-[10px] font-mono text-white/30 truncate flex-1">IMG_{index + 1}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      {images.length > 0 && (
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onImagesChange([])}
            variant="outline"
            size="sm"
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-black/20 rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Libérer tout
          </Button>
        </div>
      )}

      {/* Informations Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/5 rounded-2xl p-5">
        <div className="relative z-10 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
            <ImageIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm">Guide d'optimisation UI</h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              <li className="text-[11px] text-white/50 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2" />
                Haute résolution (min. 800px)
              </li>
              <li className="text-[11px] text-white/50 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2" />
                Format PNG pour les logos
              </li>
              <li className="text-[11px] text-white/50 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2" />
                Poids max conseillé 5Mo
              </li>
              <li className="text-[11px] text-white/50 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2" />
                Recadrage carré recommandé
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      {selectedImageForCrop && (
        <ImageCropper
          imageSrc={selectedImageForCrop.src}
          open={cropperOpen}
          onClose={() => setCropperOpen(false)}
          onCompleted={onCropCompleted}
          aspect={1} // Always square as requested
        />
      )}
    </div>
  )
}
