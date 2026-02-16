"use client"

import { useEffect, useRef, useState } from "react"
import { AUDIO_STORAGE_KEY, defaultTracks, type AudioTrack } from "@/data/audio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Music4, Plus, Save, Trash2, ArrowUp, ArrowDown, Play, Pause } from "lucide-react"
import AudioUpload from "@/components/admin/audio-upload"
import ImagePicker from "@/components/admin/image-picker"

function genId(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() || `track-${Math.random().toString(36).slice(2, 8)}`
  )
}

export default function AudioManager() {
  const [tracks, setTracks] = useState<AudioTrack[]>(defaultTracks)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Load stored tracks
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUDIO_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AudioTrack[]
        if (Array.isArray(parsed)) setTracks(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  // Save helper
  const saveAll = () => {
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(tracks))
    alert("Pistes enregistrées.")
  }

  const resetDefaults = () => {
    if (!confirm("Réinitialiser le lecteur aux valeurs par défaut ?")) return
    setTracks(defaultTracks)
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(defaultTracks))
  }

  const addTrack = () => {
    setTracks((prev) => [
      ...prev,
      {
        id: genId("nouvelle-piste"),
        title: "Nouvelle piste",
        artist: "",
        src: "",
        format: "unknown",
        cover: undefined,
      },
    ])
    setEditIndex(tracks.length)
  }

  const deleteTrack = (idx: number) => {
    if (!confirm("Supprimer cette piste ?")) return
    setTracks((prev) => prev.filter((_, i) => i !== idx))
    if (editIndex === idx) setEditIndex(null)
    if (previewIndex === idx) {
      setPreviewIndex(null)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }

  const moveUp = (idx: number) => {
    if (idx <= 0) return
    setTracks((prev) => {
      const c = [...prev]
      ;[c[idx - 1], c[idx]] = [c[idx], c[idx - 1]]
      return c
    })
    setEditIndex((i) => (i === idx ? idx - 1 : i))
  }

  const moveDown = (idx: number) => {
    if (idx >= tracks.length - 1) return
    setTracks((prev) => {
      const c = [...prev]
      ;[c[idx + 1], c[idx]] = [c[idx], c[idx + 1]]
      return c
    })
    setEditIndex((i) => (i === idx ? idx + 1 : i))
  }

  const updateField = (idx: number, field: keyof AudioTrack, value: any) => {
    setTracks((prev) => {
      const copy = [...prev]
      ;(copy[idx] as any)[field] = value
      if (field === "title" && value) copy[idx].id = genId(String(value))
      return copy
    })
  }

  const togglePreview = (idx: number) => {
    const tr = tracks[idx]
    if (!tr?.src || tr.format !== "mp3") {
      alert("Cette piste n’est pas lisible dans le navigateur (convertissez en MP3).")
      return
    }
    if (previewIndex === idx) {
      // pause
      audioRef.current?.pause()
      setPreviewIndex(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = tr.src
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {
          /* ignore */
        })
      }
      setPreviewIndex(idx)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Music4 className="w-5 h-5" />
            Lecteur audio — Pistes ({tracks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tracks.map((t, idx) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {/* cover */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.cover || "/placeholder.svg?height=56&width=56&query=cover"}
                  alt={t.title}
                  className="w-14 h-14 rounded bg-white/10 object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">{t.title}</Badge>
                    {t.artist && <span className="text-white/60 text-sm">par {t.artist}</span>}
                  </div>
                  <p className="text-white/60 text-xs break-all">
                    {t.src ? (t.src.startsWith("data:") ? "data URL" : t.src) : "—"}{" "}
                    <span className="ml-2 text-white/40">({t.format})</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="border-white/30 text-white bg-transparent hover:bg-white/10"
                  onClick={() => moveUp(idx)}
                  title="Monter"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-white/30 text-white bg-transparent hover:bg-white/10"
                  onClick={() => moveDown(idx)}
                  title="Descendre"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setEditIndex(idx)}>
                  Modifier
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  title="Supprimer"
                  onClick={() => deleteTrack(idx)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => togglePreview(idx)}
                  title="Pré-écouter"
                >
                  {previewIndex === idx ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button onClick={addTrack} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une piste
            </Button>
            <Button onClick={saveAll} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
            <Button
              onClick={resetDefaults}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Réinitialiser
            </Button>
          </div>
          <audio ref={audioRef} className="hidden" controls />
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Édition piste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {editIndex === null ? (
            <p className="text-white/60">Sélectionnez une piste pour l’éditer ou créez-en une nouvelle.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Titre</Label>
                  <Input
                    value={tracks[editIndex].title}
                    onChange={(e) => updateField(editIndex, "title", e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Artiste</Label>
                  <Input
                    value={tracks[editIndex].artist || ""}
                    onChange={(e) => updateField(editIndex, "artist", e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <AudioUpload
                value={{ src: tracks[editIndex].src, format: tracks[editIndex].format }}
                onChange={(v) => {
                  updateField(editIndex, "src", v?.src || "")
                  updateField(editIndex, "format", v?.format || "unknown")
                }}
                hint="Seuls les fichiers MP3 sont acceptés pour la lecture dans le navigateur."
              />

              <ImagePicker
                label="Pochette (optionnelle)"
                value={tracks[editIndex].cover}
                onChange={(v) => updateField(editIndex, "cover", v)}
                hint="Image carrée (min. 128×128) pour illustrer la piste."
              />

              <div className="flex gap-2">
                <Button onClick={saveAll} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
                <Button
                  onClick={() => setEditIndex(null)}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  Fermer
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
