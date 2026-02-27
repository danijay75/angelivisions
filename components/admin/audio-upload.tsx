"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Music2, Upload, LinkIcon, Trash2 } from "lucide-react"

type Props = {
  label?: string
  value?: { src?: string; format?: "mp3" | "unknown" } // Suppression du format "aaf"
  onChange: (val: { src?: string; format?: "mp3" | "unknown" } | undefined) => void
  hint?: string
}

function guessFormatFromName(name?: string, type?: string): "mp3" | "unknown" {
  // Suppression du format "aaf"
  const lower = (name || "").toLowerCase()
  if (type?.includes("mpeg") || lower.endsWith(".mp3")) return "mp3"
  return "unknown"
}

export default function AudioUpload({ label = "Fichier audio", value, onChange, hint }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | undefined>(undefined)

  const onPickFile = () => fileRef.current?.click()

  const onFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const fmt = guessFormatFromName(file.name, file.type)
      onChange({ src: dataUrl, format: fmt })
      setFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const onUseUrl = () => {
    const v = urlRef.current?.value?.trim()
    if (!v) return
    const fmt = guessFormatFromName(v, "")
    onChange({ src: v, format: fmt })
    if (urlRef.current) urlRef.current.value = ""
    setFileName(v.split("/").pop())
  }

  const clear = () => {
    onChange(undefined)
    setFileName(undefined)
  }

  return (
    <div className="space-y-3">
      <Label className="text-white">{label}</Label>
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              <Music2 className="w-8 h-8 text-white/60" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={onPickFile}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importer MP3 {/* Suppression de "/AAF" */}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".mp3,audio/mpeg,audio/*" // Suppression de ".aaf"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
                <div className="flex gap-2 items-center">
                  <Input
                    ref={urlRef}
                    placeholder="Coller une URL audio MP3" // Suppression de "ou AAF"
                    className="bg-white/10 border-white/20 text-white h-9 w-64"
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
                {value?.src && (
                  <Button type="button" variant="destructive" size="sm" onClick={clear}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                )}
              </div>
              <div className="text-sm text-white/80">
                {fileName ? (
                  <p>
                    Fichier: <span className="font-medium">{fileName}</span>{" "}
                    <span className="text-white/60">({value?.format || "unknown"})</span>
                  </p>
                ) : value?.src ? (
                  <p className="break-all">
                    Source: <span className="font-medium">{value.src}</span>{" "}
                    <span className="text-white/60">({value.format || "unknown"})</span>
                  </p>
                ) : (
                  <p className="text-white/60">Aucun fichier sélectionné</p>
                )}
                {hint && <p className="text-white/60 text-xs mt-1">{hint}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
