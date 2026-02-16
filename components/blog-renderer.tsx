"use client"
import type { BlogBlock } from "@/data/blog"
import { cn } from "@/lib/utils"

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url)
}
function isVimeo(url: string) {
  return /vimeo\.com/.test(url)
}

export function BlogRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <article className="prose prose-invert max-w-3xl w-full mx-auto prose-headings:scroll-mt-20">
      {blocks.map((b, i) => {
        if (b.type === "paragraph") {
          return <div key={i} className="prose-p:my-4" dangerouslySetInnerHTML={{ __html: b.html }} />
        }
        if (b.type === "image") {
          return (
            <figure key={i} className="my-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.src || "/placeholder.svg?height=600&width=1000&query=blog-image"}
                alt={b.alt || ""}
                className="rounded-lg border border-white/10 w-full object-cover"
                loading="lazy"
              />
              {b.caption ? <figcaption className="mt-2 text-sm text-white/60">{b.caption}</figcaption> : null}
            </figure>
          )
        }
        if (b.type === "video") {
          const url = b.url
          if (isYouTube(url)) {
            const idMatch = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
            const id = idMatch ? idMatch[1] : ""
            return (
              <div key={i} className="my-6">
                <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden border border-white/10">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${id}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                {b.caption ? <p className="mt-2 text-sm text-white/60">{b.caption}</p> : null}
              </div>
            )
          }
          if (isVimeo(url)) {
            return (
              <div key={i} className="my-6">
                <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden border border-white/10">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={url.replace("vimeo.com", "player.vimeo.com/video")}
                    title="Vimeo player"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {b.caption ? <p className="mt-2 text-sm text-white/60">{b.caption}</p> : null}
              </div>
            )
          }
          return (
            <div key={i} className="my-6">
              <video src={url} controls className="w-full rounded-lg border border-white/10" preload="metadata" />
              {b.caption ? <p className="mt-2 text-sm text-white/60">{b.caption}</p> : null}
            </div>
          )
        }
        if (b.type === "embed") {
          return (
            <div key={i} className={cn("my-6 rounded-lg overflow-hidden border border-white/10 p-2")}>
              <div className="embed-container" dangerouslySetInnerHTML={{ __html: b.html }} />
              {b.caption ? <p className="mt-2 text-sm text-white/60">{b.caption}</p> : null}
            </div>
          )
        }
        return null
      })}
    </article>
  )
}
