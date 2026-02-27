"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Upload, LinkIcon, Trash2, Loader2 } from "lucide-react"

interface ImagePickerProps {
  label?: string
  value?: string // URL or data URL
  onChange: (value: string | undefined) => void
  hint?: string
}

export default function ImagePicker({ label = "Logo / Icône", value, onChange, hint }: ImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)

  const [isUploading, setIsUploading] = useState(false)

  const onFile = async (file?: File) => {
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Erreur d'upload")
        return
      }

      const data = await res.json()
      onChange(data.url)
    } catch (e) {
      alert("Erreur de connexion lors de l'upload")
    } finally {
      setIsUploading(false)
    }
  }

  const onPickFile = () => fileRef.current?.click()

  const onUseUrl = () => {
    const v = urlRef.current?.value?.trim()
    if (!v) return
    onChange(v)
    if (urlRef.current) urlRef.current.value = ""
  }

  const clear = () => onChange(undefined)

  return (
    <div className="space-y-3">
      <Label className="text-white">{label}</Label>

      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col xl:flex-row items-start gap-4">
            <div className="w-24 h-24 shrink-0 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value || "/placeholder.svg"}
                  alt="Aperçu logo service"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement
                    el.src = "/placeholder.svg?height=96&width=96"
                  }}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-white/50" />
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={onPickFile}
                  disabled={isUploading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {isUploading ? "Upload en cours..." : "Importer depuis l’ordinateur"}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />

                <div className="flex gap-2 items-center">
                  <Input
                    ref={urlRef}
                    placeholder="Coller une URL d’image"
                    className="bg-white/10 border-white/20 text-white h-9 w-56"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/30 text-white bg-transparent"
                    size="sm"
                    onClick={onUseUrl}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Utiliser URL
                  </Button>
                </div>

                {value && (
                  <Button type="button" variant="destructive" size="sm" onClick={clear}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                )}
              </div>

              {hint && <p className="text-white/60 text-xs">{hint}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
