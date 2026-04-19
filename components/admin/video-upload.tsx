"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, Upload, X, Trash2, Loader2, Play, LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

interface VideoUploadProps {
  videos: string[]
  onVideosChange: (videos: string[]) => void
  maxVideos?: number
  label?: string
}

export default function VideoUpload({ videos, onVideosChange, maxVideos = 10, label = "Vidéos" }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlValue, setUrlValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddUrl = () => {
    const trimmed = urlValue.trim()
    if (!trimmed) return
    
    if (videos.length >= maxVideos) {
      alert(`Maximum ${maxVideos} vidéos atteint`)
      return
    }

    onVideosChange([...videos, trimmed])
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
    const videoFiles = fileArray.filter((file) => file.type.startsWith("video/"))

    if (videoFiles.length === 0) {
      alert("Veuillez sélectionner uniquement des fichiers vidéo (.mp4, .mov...)")
      return
    }

    if (videos.length + videoFiles.length > maxVideos) {
      alert(`Vous ne pouvez télécharger que ${maxVideos} vidéos maximum`)
      return
    }

    setUploading(true)

    const uploadedUrls: string[] = []
    for (const file of videoFiles) {
      const url = await uploadFile(file)
      if (url) uploadedUrls.push(url)
    }

    if (uploadedUrls.length > 0) {
      onVideosChange([...videos, ...uploadedUrls])
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

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index)
    onVideosChange(newVideos)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-white/90">
        <label className="font-semibold text-sm tracking-wide uppercase">{label}</label>
        <span className="text-white/40 text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          {videos.length} / {maxVideos} MAX
        </span>
      </div>

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
                {uploading ? "Transfert en cours..." : "Téléchargez vos vidéos"}
              </h3>
              <p className="text-white/40 text-sm max-w-xs mx-auto">
                Faites glisser vos fichiers .mp4 ou .mov ou <span className="text-purple-400 hover:text-purple-300 font-medium">parcourez</span>
              </p>
            </div>
            
            <div className="text-[10px] font-bold text-white/30 tracking-widest px-2 py-0.5 mt-2 inline-block rounded border border-white/5 bg-white/5 uppercase">
              Max 100 Mo
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none group-focus-within:text-purple-400 transition-colors duration-300">
            <LinkIcon className="w-4 h-4 text-white/40" />
          </div>
          <Input
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="Ou collez l'URL d'une vidéo (YouTube, Vimeo, mp4...)"
            className="pl-10 bg-white/5 border-white/10 text-white h-11 rounded-xl focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 transition-all duration-300"
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
        multiple={maxVideos > 1}
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <AnimatePresence mode="popLayout">
            {videos.map((video, index) => (
              <motion.div
                key={video + index}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="relative group h-40"
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-xl">
                  {video.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || video.includes('vps-') ? (
                    <video
                      src={video}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-white/10 text-white/40 gap-2">
                      <Video className="w-8 h-8" />
                      <span className="text-[10px] uppercase tracking-tighter opacity-50 px-2 text-center">Lien Externe / Streaming</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeVideo(index)
                      }}
                      size="icon"
                      variant="destructive"
                      className="bg-red-500/80 hover:bg-red-500 text-white rounded-xl w-10 h-10 border border-red-400/20 backdrop-blur-md"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <a
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-xl w-10 h-10 border border-white/20 backdrop-blur-md flex items-center justify-center"
                    >
                      <Play className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 flex justify-between items-center">
                  <p className="text-[10px] font-mono text-white/60 truncate pr-2">
                    {video.startsWith('http') ? video.split('/').pop() : `VID_${index + 1}.mp4`}
                  </p>
                  <span className={`w-1.5 h-1.5 rounded-full ${video.startsWith('http') ? 'bg-purple-500' : 'bg-emerald-500'} shadow-[0_0_5px_rgba(168,85,247,0.5)]`} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
