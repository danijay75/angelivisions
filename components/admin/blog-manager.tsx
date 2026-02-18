"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { sanitizeHtml } from "@/lib/sanitizer"
import { BLOG_STORAGE_KEY, defaultPosts, type BlogBlock, type BlogPost, type BlogSEO } from "@/data/blog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, Trash2, Edit, X, ArrowUp, ArrowDown, ImageIcon, Video, Code2, Type, RefreshCw } from "lucide-react"
import ImagePicker from "@/components/admin/image-picker"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function slugify(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

type BlockKind = BlogBlock["type"]

function Toolbar({ targetRef }: { targetRef: React.RefObject<HTMLDivElement> }) {
  const exec = (cmd: string, value?: string) => {
    targetRef.current?.focus()
    document.execCommand(cmd, false, value)
  }
  return (
    <div className="flex flex-wrap gap-2 p-2 border border-white/10 rounded-md bg-white/5">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/30 text-white bg-transparent"
        onClick={() => exec("bold")}
      >
        <strong>B</strong>
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/30 text-white bg-transparent"
        onClick={() => exec("italic")}
      >
        <em>I</em>
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/30 text-white bg-transparent"
        onClick={() => exec("insertUnorderedList")}
      >
        • Liste
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/30 text-white bg-transparent"
        onClick={() => exec("insertOrderedList")}
      >
        1. Liste
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/30 text-white bg-transparent"
        onClick={() => exec("formatBlock", "<h2>")}
      >
        H2
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/30 text-white bg-transparent"
        onClick={() => exec("formatBlock", "<h3>")}
      >
        H3
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/30 text-white bg-transparent"
        onClick={() => {
          const url = prompt("URL du lien:")
          if (url) exec("createLink", url)
        }}
      >
        Lien
      </Button>
    </div>
  )
}

function toPlainText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function useReadingStats(draft: BlogPost | null) {
  if (!draft) return { words: 0, minutes: 1 }
  const text = draft.blocks
    .filter((b) => b.type === "paragraph")
    .map((b: any) => toPlainText(b.html || ""))
    .join(" ")
  const words = text ? text.split(" ").length : 0
  const minutes = Math.max(1, Math.round(words / 200))
  return { words, minutes }
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<BlogPost | null>(null)
  const [tagInput, setTagInput] = useState("")

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BLOG_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as BlogPost[]
        if (Array.isArray(parsed) && parsed.length) {
          setPosts(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts],
  )

  const saveAll = () => {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts))
    alert("Articles enregistrés.")
  }

  const resetDefaults = () => {
    if (!confirm("Réinitialiser le blog avec les articles par défaut ?")) return
    setPosts(defaultPosts)
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(defaultPosts))
  }

  const newPost = () => {
    const slug = "nouvel-article"
    const p: BlogPost = {
      id: slug,
      slug,
      title: "Nouvel article",
      excerpt: "",
      date: new Date().toISOString(),
      author: "Rédaction",
      coverImage: undefined,
      published: false,
      seo: {
        robots: { index: false, follow: true },
        ogType: "article",
        twitterCard: "summary_large_image",
        tags: [],
      },
      blocks: [{ type: "paragraph", html: "<p>Votre contenu...</p>" }],
    }
    setPosts((prev) => [p, ...prev])
    setEditingIndex(0)
    setDraft(p)
  }

  const startEdit = (i: number) => {
    setEditingIndex(i)
    setDraft(JSON.parse(JSON.stringify(sortedPosts[i])))
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setDraft(null)
  }

  const commitEdit = () => {
    if (!draft) return
    const idxInOriginal = posts.findIndex((p) => p.id === draft.id)
    const updated = [...posts]
    if (idxInOriginal >= 0) updated[idxInOriginal] = draft
    setPosts(updated)
    setEditingIndex(null)
    setDraft(null)
    saveAll()
  }

  const deletePost = (i: number) => {
    const post = sortedPosts[i]
    if (!confirm(`Supprimer l'article "${post.title}" ?`)) return
    setPosts((prev) => prev.filter((p) => p.id !== post.id))
    if (editingIndex === i) cancelEdit()
    setTimeout(saveAll, 0)
  }

  // Editing helpers
  const updateDraft = (patch: Partial<BlogPost>) => {
    if (!draft) return
    setDraft({ ...draft, ...patch })
  }
  const setTitle = (t: string) => {
    const slug = draft?.slug ? draft.slug : slugify(t || "")
    updateDraft({ title: t, slug, id: slug })
  }
  const updateSEO = (patch: Partial<BlogSEO>) => {
    if (!draft) return
    updateDraft({ seo: { ...(draft.seo || {}), ...patch } })
  }

  // Blocks
  const addBlock = (type: BlockKind) => {
    if (!draft) return
    const newBlock: BlogBlock =
      type === "paragraph"
        ? { type: "paragraph", html: "<p>Nouveau paragraphe</p>" }
        : type === "image"
          ? { type: "image", src: "", alt: "", caption: "" }
          : type === "video"
            ? { type: "video", url: "", caption: "" }
            : { type: "embed", html: "<div>Collez ici votre code embed</div>", caption: "" }
    updateDraft({ blocks: [...draft.blocks, newBlock] })
  }

  const moveBlock = (index: number, dir: -1 | 1) => {
    if (!draft) return
    const arr = [...draft.blocks]
    const ni = index + dir
    if (ni < 0 || ni >= arr.length) return
    const tmp = arr[index]
    arr[index] = arr[ni]
    arr[ni] = tmp
    updateDraft({ blocks: arr })
  }

  const removeBlock = (index: number) => {
    if (!draft) return
    const arr = [...draft.blocks]
    arr.splice(index, 1)
    updateDraft({ blocks: arr })
  }

  // ContentEditable refs for paragraph blocks
  const paraRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const setParaRef = (i: number, el: HTMLDivElement | null) => {
    paraRefs.current[i] = el
  }
  const syncParagraphHtml = (i: number) => {
    if (!draft) return
    const el = paraRefs.current[i]
    const arr = [...draft.blocks]
    const b = arr[i]
    if (b && b.type === "paragraph") {
      ; (b as any).html = el?.innerHTML || ""
      updateDraft({ blocks: arr })
    }
  }

  const { minutes } = useReadingStats(draft)

  // Tag helpers
  const addTag = () => {
    if (!draft) return
    const raw = tagInput.trim()
    if (!raw) return
    const tag = raw.replace(/\s+/g, " ")
    const tags = Array.from(new Set([...(draft.seo?.tags || []), tag]))
    updateSEO({ tags })
    setTagInput("")
  }
  const removeTag = (t: string) => {
    if (!draft) return
    updateSEO({ tags: (draft.seo?.tags || []).filter((x) => x !== t) })
  }

  // SEO length helpers
  const seoTitle = draft?.seo?.title ?? draft?.title ?? ""
  const seoDescription = draft?.seo?.description ?? draft?.excerpt ?? ""
  const titleLen = seoTitle.length
  const descLen = seoDescription.length
  const titleOk = titleLen >= 30 && titleLen <= 60
  const descOk = descLen >= 70 && descLen <= 160

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* List */}
      <Card className="bg-slate-900 border-white/10 h-fit">
        <CardHeader className="flex gap-2 justify-between items-center bg-white/5 border-b border-white/10">
          <CardTitle className="text-white">Articles ({sortedPosts.length})</CardTitle>
          <div className="flex gap-2">
            <Button onClick={newPost} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {sortedPosts.map((p, i) => (
            <div key={p.id} className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.coverImage || "/placeholder.svg?height=64&width=64&query=cover"}
                  alt={String(p.title)}
                  className="w-16 h-16 rounded object-cover bg-white/10"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-white/10 text-white/70 text-[10px]">{String(new Date(p.date).toLocaleDateString("fr-FR"))}</Badge>
                    <Badge className={p.published !== false ? "bg-green-600/80" : "bg-yellow-600/80 text-white"}>
                      {p.published !== false ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <div className="text-white font-medium line-clamp-1">{String(p.title)}</div>
                  <div className="text-white/50 text-xs truncate max-w-[150px]">/{String(p.slug)}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="icon" className="h-7 w-7 bg-blue-600 hover:bg-blue-700" onClick={() => startEdit(i)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => deletePost(i)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <Button onClick={saveAll} className="flex-1 bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Tout enregistrer
            </Button>
            <Button size="icon" variant="outline" className="border-white/30 text-white bg-transparent" onClick={resetDefaults} title="Réinitialiser">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="bg-slate-900 border-white/10">
        <CardHeader className="bg-white/5 border-b border-white/10">
          <CardTitle className="text-white">Éditeur de Contenu</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {editingIndex === null || !draft ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/40">
              <Edit className="w-16 h-16 mb-4 opacity-20" />
              <p>Sélectionnez un article à modifier ou créez-en un nouveau.</p>
            </div>
          ) : (
            <>
              {/* Basics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Titre</Label>
                  <Input
                    value={draft.title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Slug (URL)</Label>
                  <Input
                    value={draft.slug}
                    onChange={(e) => updateDraft({ slug: e.target.value, id: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Date de publication</Label>
                  <Input
                    type="date"
                    value={draft.date.slice(0, 10)}
                    onChange={(e) => {
                      const d = e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString()
                      updateDraft({ date: d })
                    }}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-white">Auteur</Label>
                  <Input
                    value={draft.author || ""}
                    onChange={(e) => updateDraft({ author: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-white">Extrait (chapô)</Label>
                  <Textarea
                    value={draft.excerpt || ""}
                    onChange={(e) => updateDraft({ excerpt: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500 min-h-[100px]"
                  />
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="published"
                      checked={draft.published !== false}
                      onCheckedChange={(v) => updateDraft({ published: !!v })}
                    />
                    <Label htmlFor="published" className="text-white cursor-pointer">
                      {draft.published !== false ? "Publié (Visible)" : "Brouillon (Caché)"}
                    </Label>
                  </div>
                </div>
              </div>

              <ImagePicker
                label="Image de couverture"
                value={draft.coverImage}
                onChange={(v) => updateDraft({ coverImage: v })}
                hint="Format 16:9 recommandé"
              />

              {/* Blocks */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Contenu de l'article</h3>

                <div className="sticky top-4 z-10 bg-slate-900/95 backdrop-blur border border-white/10 p-2 rounded-lg flex flex-wrap gap-2 shadow-xl">
                  <Button size="sm" variant="secondary" onClick={() => addBlock("paragraph")}>
                    <Type className="w-4 h-4 mr-2" /> Paragraphe
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => addBlock("image")}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Image
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => addBlock("video")}>
                    <Video className="w-4 h-4 mr-2" /> Vidéo
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => addBlock("embed")}>
                    <Code2 className="w-4 h-4 mr-2" /> Code
                  </Button>
                </div>

                <div className="space-y-6 min-h-[300px]">
                  {draft.blocks.map((b, i) => (
                    <div key={`block-${i}`} className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/20 transition-colors group">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-purple-300 border-purple-500/30 uppercase text-xs tracking-wider">{b.type}</Badge>
                        <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:bg-white/10" onClick={() => moveBlock(i, -1)}>
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:bg-white/10" onClick={() => moveBlock(i, 1)}>
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => removeBlock(i)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {b.type === "paragraph" && (
                        <div className="space-y-2">
                          <Toolbar targetRef={{ current: paraRefs.current[i] || null }} />
                          <div
                            ref={(el) => setParaRef(i, el)}
                            contentEditable
                            suppressContentEditableWarning
                            className="min-h-[120px] p-4 rounded-md bg-black/20 border border-white/10 focus:outline-none focus:border-purple-500/50 text-white/90 leading-relaxed"
                            onBlur={() => syncParagraphHtml(i)}
                            dangerouslySetInnerHTML={{ __html: (b as any).html }}
                          />
                        </div>
                      )}

                      {/* Same strict "check before render" logic applied to other block types implicitly by inputs */}
                      {b.type === "image" && (
                        <div className="space-y-3">
                          <ImagePicker
                            value={(b as any).src}
                            onChange={(v) => {
                              const arr = [...draft.blocks]; (arr[i] as any).src = v || ""; updateDraft({ blocks: arr })
                            }}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Texte alternatif (SEO)" value={(b as any).alt || ""} onChange={e => {
                              const arr = [...draft.blocks]; (arr[i] as any).alt = e.target.value; updateDraft({ blocks: arr })
                            }} className="bg-black/20 border-white/10 text-white" />
                            <Input placeholder="Légende" value={(b as any).caption || ""} onChange={e => {
                              const arr = [...draft.blocks]; (arr[i] as any).caption = e.target.value; updateDraft({ blocks: arr })
                            }} className="bg-black/20 border-white/10 text-white" />
                          </div>
                        </div>
                      )}

                      {b.type === "video" && (
                        <div className="space-y-3">
                          <Input
                            placeholder="URL YouTube / Vimeo"
                            value={(b as any).url || ""}
                            onChange={e => {
                              const arr = [...draft.blocks]; (arr[i] as any).url = e.target.value; updateDraft({ blocks: arr })
                            }}
                            className="bg-black/20 border-white/10 text-white"
                          />
                          <Input
                            placeholder="Légende"
                            value={(b as any).caption || ""}
                            onChange={e => {
                              const arr = [...draft.blocks]; (arr[i] as any).caption = e.target.value; updateDraft({ blocks: arr })
                            }}
                            className="bg-black/20 border-white/10 text-white"
                          />
                        </div>
                      )}

                      {b.type === "embed" && (
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Collez votre code iframe ici..."
                            value={(b as any).html || ""}
                            onChange={e => {
                              const arr = [...draft.blocks]; (arr[i] as any).html = e.target.value; updateDraft({ blocks: arr })
                            }}
                            className="bg-black/20 border-white/10 text-white font-mono text-xs min-h-[100px]"
                          />
                          <Input
                            placeholder="Légende"
                            value={(b as any).caption || ""}
                            onChange={e => {
                              const arr = [...draft.blocks]; (arr[i] as any).caption = e.target.value; updateDraft({ blocks: arr })
                            }}
                            className="bg-black/20 border-white/10 text-white"
                          />
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="sticky bottom-4 z-10 bg-slate-900/95 backdrop-blur border border-white/10 p-4 rounded-xl flex items-center justify-between shadow-2xl">
                <div className="text-xs text-white/50">
                  <span className={titleOk ? "text-green-400" : "text-yellow-400"}>Titre SEO: {titleLen}/60</span> •
                  <span className={descOk ? "text-green-400 ml-2" : "text-yellow-400 ml-2"}>Desc: {descLen}/160</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={commitEdit} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
                    <Save className="w-4 h-4 mr-2" /> Enregistrer les modifications
                  </Button>
                  <Button onClick={cancelEdit} variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                    Annuler
                  </Button>
                </div>
              </div>

            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
