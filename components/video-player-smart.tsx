"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface VideoPlayerSmartProps {
  src: string
  className?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  onEnded?: () => void
  priority?: boolean
}

export default function VideoPlayerSmart({
  src,
  className,
  autoplay = false,
  muted = false,
  loop = false,
  controls = false,
  onEnded,
  priority = false
}: VideoPlayerSmartProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const bgVideoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Sync background video with main video
  useEffect(() => {
    const video = videoRef.current
    const bgVideo = bgVideoRef.current
    if (!video || !bgVideo) return

    const handlePlay = () => bgVideo.play()
    const handlePause = () => bgVideo.pause()
    const handleSeeking = () => {
      bgVideo.currentTime = video.currentTime
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("seeking", handleSeeking)
    
    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("seeking", handleSeeking)
    }
  }, [])

  return (
    <div className={cn("relative w-full aspect-video bg-black overflow-hidden group", className)}>
      {/* Background Video (Blurred) */}
      <video
        ref={bgVideoRef}
        src={src}
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50 transition-opacity duration-700"
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        style={{ filter: "blur(40px) brightness(0.6)" }}
      />

      {/* Main Video (Foreground) */}
      <video
        ref={videoRef}
        src={src}
        className={cn(
          "relative z-10 w-full h-full object-contain transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        onEnded={onEnded}
        preload={priority ? "auto" : "metadata"}
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-20">
           <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
