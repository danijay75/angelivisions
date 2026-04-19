"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import VideoPlayerSmart from "./video-player-smart"

interface VideoLightboxProps {
  videos: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export default function VideoLightbox({
  videos,
  initialIndex = 0,
  isOpen,
  onClose
}: VideoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen, initialIndex])

  const next = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
       // Loop back or close? User said "enchainer automatiquement", usually means loop or just stop at the end.
       // Let's loop for now as it feels more premium.
       setCurrentIndex(0)
    }
  }, [currentIndex, videos.length])

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(videos.length - 1)
    }
  }, [currentIndex, videos.length])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose, next, prev])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] text-white hover:bg-white/10 rounded-full"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Navigation Buttons */}
        {videos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] text-white hover:bg-white/10 rounded-full hidden md:flex"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] text-white hover:bg-white/10 rounded-full hidden md:flex"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </>
        )}

        {/* Video Player */}
        <div className="w-full max-w-6xl aspect-video shadow-2xl rounded-xl overflow-hidden border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <VideoPlayerSmart
                src={videos[currentIndex]}
                autoplay={true}
                controls={true}
                onEnded={next} // Enable auto-advance
                priority={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Preview Area (Optional, but elegant) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {videos.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-purple-500 w-6' : 'bg-white/20'}`}
                />
            ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
