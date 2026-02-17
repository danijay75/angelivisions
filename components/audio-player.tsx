"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Minimize2, X, Music2 } from "lucide-react"
import { AUDIO_STORAGE_KEY, defaultTracks, type AudioTrack } from "@/data/audio"

import { useI18n } from "@/components/i18n/i18n-provider"

export default function AudioPlayer() {
  const { t } = useI18n()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [tracks, setTracks] = useState<AudioTrack[]>(defaultTracks)
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load tracks from storage
  useEffect(() => {
    try {
      const closed = localStorage.getItem("audioPlayerClosed")
      if (closed === "true") setIsVisible(false)
      const raw = localStorage.getItem(AUDIO_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AudioTrack[]
        if (Array.isArray(parsed) && parsed.length) setTracks(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  // Setup audio element
  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const onTime = () => setCurrentTime(el.currentTime || 0)
    const onLoaded = () => setDuration(Number.isFinite(el.duration) ? el.duration : 0)
    const onEnd = () => nextTrack()
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    el.addEventListener("timeupdate", onTime)
    el.addEventListener("loadedmetadata", onLoaded)
    el.addEventListener("ended", onEnd)
    el.addEventListener("play", onPlay)
    el.addEventListener("pause", onPause)

    return () => {
      el.removeEventListener("timeupdate", onTime)
      el.removeEventListener("loadedmetadata", onLoaded)
      el.removeEventListener("ended", onEnd)
      el.removeEventListener("play", onPlay)
      el.removeEventListener("pause", onPause)
    }
  }, [])

  // Update src when currentTrack changes
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const tr = tracks[currentTrack]
    if (!tr) return

    // Skip non-playable formats
    if (tr.format !== "mp3" || !tr.src) {
      // find next playable
      const nextPlayable = tracks.findIndex((t, i) => i > currentTrack && t.format === "mp3" && !!t.src)
      if (nextPlayable !== -1) {
        setCurrentTrack(nextPlayable)
        return
      }
      // no playable — stop
      el.pause()
      setIsPlaying(false)
      return
    }

    el.src = tr.src
    el.muted = isMuted
    el.volume = volume
    if (isPlaying) {
      el.play().catch(() => {
        /* ignore play errors */
      })
    } else {
      el.pause()
    }
  }, [currentTrack, tracks, isMuted, volume, isPlaying])

  // Visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isVisible) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 300
    canvas.height = 60
    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const bars = 50
      const barWidth = canvas.width / bars

      for (let i = 0; i < bars; i++) {
        const base = isPlaying ? 40 : 10
        const barHeight = Math.random() * base + 5
        const x = i * barWidth
        const y = (canvas.height - barHeight) / 2
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#8B5CF6")
        gradient.addColorStop(1, "#EC4899")
        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth - 1, barHeight)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isPlaying, isVisible])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying) {
      el.pause()
    } else {
      // Try to play current if playable
      const tr = tracks[currentTrack]
      if (tr?.format === "mp3" && tr.src) {
        el.play().catch(() => {
          /* ignore */
        })
      } else {
        // find first playable
        const firstPlayable = tracks.findIndex((t) => t.format === "mp3" && !!t.src)
        if (firstPlayable !== -1) setCurrentTrack(firstPlayable)
      }
    }
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => {
      const len = tracks.length
      for (let i = 1; i <= len; i++) {
        const idx = (prev + i) % len
        if (tracks[idx]?.format === "mp3" && tracks[idx]?.src) return idx
      }
      return prev
    })
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => {
      const len = tracks.length
      for (let i = 1; i <= len; i++) {
        const idx = (prev - i + len) % len
        if (tracks[idx]?.format === "mp3" && tracks[idx]?.src) return idx
      }
      return prev
    })
  }

  const toggleMute = () => {
    const el = audioRef.current
    if (!el) return
    const next = !isMuted
    setIsMuted(next)
    el.muted = next
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const closePlayer = () => {
    setIsPlaying(false)
    setIsVisible(false)
    localStorage.setItem("audioPlayerClosed", "true")
    audioRef.current?.pause()
  }

  const tr = tracks[currentTrack]
  const hasPlayable = useMemo(() => tracks.some((t) => t.format === "mp3" && !!t.src), [tracks])

  if (!hasPlayable && tracks.length === 0) {
    // Hide if nothing configured
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <Card className="bg-black/80 backdrop-blur-md border-white/20 overflow-hidden">
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {isMinimized ? (
                  <motion.div
                    key="minimized"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        onClick={togglePlay}
                        disabled={!hasPlayable}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </Button>
                      <div className="text-white">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Music2 className="w-4 h-4 text-white/60" />
                          {tr?.title || t("audio.title")}
                        </p>
                        <p className="text-xs text-white/60">{tr?.artist || "—"}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsMinimized(false)}
                        className="text-white/60 hover:text-white"
                      >
                        <Minimize2 className="w-4 h-4 rotate-180" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={closePlayer}
                        className="text-white/60 hover:text-white"
                        title={t("audio.close")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="w-80"
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">{t("audio.creations")}</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsMinimized(true)}
                            className="text-white/60 hover:text-white"
                            title={t("audio.minimize")}
                          >
                            <Minimize2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={closePlayer}
                            className="text-white/60 hover:text-white"
                            title={t("audio.close")}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Waveform */}
                    <div className="p-4 bg-black/40">
                      <canvas ref={canvasRef} className="w-full h-15 rounded" />
                    </div>

                    {/* Track Info */}
                    <div className="p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {tr?.cover ? (
                        <img
                          src={tr.cover || "/placeholder.svg"}
                          alt={`${t("audio.coverAlt")} ${tr.title}`}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      ) : null}
                      <h4 className="text-white font-medium">{tr?.title || "—"}</h4>
                      <p className="text-white/60 text-sm">{tr?.artist || "—"}</p>
                      <div className="flex items-center justify-between text-xs text-white/40 mt-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{duration ? formatTime(duration) : "—:—"}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={prevTrack}
                          className="text-white/60 hover:text-white"
                          disabled={!hasPlayable}
                        >
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={togglePlay}
                          disabled={!hasPlayable}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={nextTrack}
                          className="text-white/60 hover:text-white"
                          disabled={!hasPlayable}
                        >
                          <SkipForward className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Volume */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleMute}
                          className="text-white/60 hover:text-white"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
          <audio ref={audioRef} className="hidden" preload="metadata" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
