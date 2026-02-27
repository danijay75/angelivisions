"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Camera, Monitor, Trash2 } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  label?: string
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10, label = "Images" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

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

    // Simuler le téléchargement et convertir en URL blob
    const newImages: string[] = []
    let processed = 0

    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          // Créer une URL blob pour l'image
          const blob = new Blob([file], { type: file.type })
          const imageUrl = URL.createObjectURL(blob)
          newImages.push(imageUrl)
        }
        processed++

        if (processed === imageFiles.length) {
          onImagesChange([...images, ...newImages])
          setUploading(false)
        }
      }
      reader.readAsArrayBuffer(file)
    })
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
      <div className="flex items-center justify-between">
        <label className="text-white font-medium">{label}</label>
        <span className="text-white/60 text-sm">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Zone de téléchargement */}
      <Card
        className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-purple-400 bg-purple-500/10"
            : "border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          <motion.div animate={{ scale: isDragging ? 1.1 : 1 }} transition={{ duration: 0.2 }} className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              {uploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Upload className="w-8 h-8 text-white" />
              )}
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">
                {uploading ? "Téléchargement en cours..." : "Télécharger des images"}
              </h3>
              <p className="text-white/70 text-sm mb-4">Glissez-déposez vos images ici ou cliquez pour sélectionner</p>

              <div className="flex items-center justify-center space-x-4 text-white/50 text-xs">
                <div className="flex items-center">
                  <Monitor className="w-4 h-4 mr-1" />
                  Ordinateur
                </div>
                <div className="flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  Mobile
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">JPG</span>
              <span className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">PNG</span>
              <span className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">WEBP</span>
              <span className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">GIF</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Prévisualisation des images */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Images téléchargées
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/10">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        // Fallback si l'image ne charge pas
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=96&width=128&text=Erreur"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs mt-1 text-center truncate">Image {index + 1}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={openFileDialog}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={uploading || images.length >= maxImages}
        >
          <Upload className="w-4 h-4 mr-2" />
          Ajouter des images
        </Button>

        {images.length > 0 && (
          <Button
            onClick={() => onImagesChange([])}
            size="sm"
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
          >
            <X className="w-4 h-4 mr-2" />
            Tout supprimer
          </Button>
        )}
      </div>

      {/* Informations */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <ImageIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-200 font-medium mb-1">Conseils pour de meilleures images :</p>
            <ul className="text-blue-100 text-xs space-y-1">
              <li>• Utilisez des images de haute qualité (min. 800x600px)</li>
              <li>• Formats recommandés : JPG pour les photos, PNG pour les logos</li>
              <li>• Taille maximale : 5MB par image</li>
              <li>• Les images seront automatiquement optimisées</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
