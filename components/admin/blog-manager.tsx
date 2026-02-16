"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { BLOG_STORAGE_KEY, defaultPosts, type BlogBlock, type BlogPost, type BlogSEO } from "@/data/blog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, Trash2, Edit, X, ArrowUp, ArrowDown, ImageIcon, Video, Code2, Type } from "lucide-react"
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
      ;(b as any).html = el?.innerHTML || ""
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
    <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
      {/* List */}
      <Card className="bg-white/5 border-white/10 h-fit">
        <CardHeader className="flex gap-2 justify-between items-center">
          <CardTitle className="text-white">Articles ({sortedPosts.length})</CardTitle>
          <div className="flex gap-2">
            <Button onClick={newPost} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedPosts.map((p, i) => (
            <div key={p.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.coverImage || "/placeholder.svg?height=64&width=64&query=cover"}
                  alt={p.title}
                  className="w-16 h-16 rounded object-cover bg-white/10"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-blue-600/80 text-white">{new Date(p.date).toLocaleDateString("fr-FR")}</Badge>
                    {p.author ? <Badge className="bg-white/10 text-white/80">{p.author}</Badge> : null}
                    <Badge className={p.published !== false ? "bg-green-600/80" : "bg-white/10 text-white"}>
                      {p.published !== false ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <div className="text-white font-medium line-clamp-1">{p.title}</div>
                  <div className="text-white/50 text-xs">/{p.slug}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => startEdit(i)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deletePost(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button onClick={saveAll} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
            <Button variant="outline" className="border-white/30 text-white bg-transparent" onClick={resetDefaults}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Éditeur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {editingIndex === null || !draft ? (
            <p className="text-white/60">Sélectionnez un article à modifier ou créez-en un nouveau.</p>
          ) : (
            <>
              {/* Basics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Titre</Label>
                  <Input
                    value={draft.title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Slug</Label>
                  <Input
                    value={draft.slug}
                    onChange={(e) => updateDraft({ slug: e.target.value, id: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white mb-2 block">Date</Label>
                  <Input
                    type="date"
                    value={draft.date.slice(0, 10)}
                    onChange={(e) => {
                      const d = e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString()
                      updateDraft({ date: d })
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-white mb-2 block">Auteur</Label>
                  <Input
                    value={draft.author || ""}
                    onChange={(e) => updateDraft({ author: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <Label className="text-white mb-2 block">Extrait</Label>
                  <Textarea
                    value={draft.excerpt || ""}
                    onChange={(e) => updateDraft({ excerpt: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="published"
                    checked={draft.published !== false}
                    onCheckedChange={(v) => updateDraft({ published: !!v })}
                  />
                  <Label htmlFor="published" className="text-white">
                    Publié
                  </Label>
                </div>
              </div>

              <ImagePicker
                label="Image de couverture"
                value={draft.coverImage}
                onChange={(v) => updateDraft({ coverImage: v })}
                hint="Importez une image (16:9 recommandé) ou collez une URL"
              />

              {/* SEO */}
              <div className="rounded-xl border border-white/10 p-4 space-y-4 bg-white/5">
                <h3 className="text-white font-semibold text-lg">SEO</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-white mb-2 block">
                      Titre SEO
                      <span className={`ml-2 text-xs ${titleOk ? "text-green-400" : "text-yellow-300"}`}>
                        {titleLen}/60
                      </span>
                    </Label>
                    <Input
                      value={draft.seo?.title ?? draft.title}
                      onChange={(e) => updateSEO({ title: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">URL canonique (facultatif)</Label>
                    <Input
                      value={draft.seo?.canonicalUrl || ""}
                      onChange={(e) => updateSEO({ canonicalUrl: e.target.value })}
                      placeholder="https://votre-domaine.com/eside-culture/slug"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">
                    Meta description
                    <span className={`ml-2 text-xs ${descOk ? "text-green-400" : "text-yellow-300"}`}>
                      {descLen}/160
                    </span>
                  </Label>
                  <Textarea
                    value={draft.seo?.description ?? draft.excerpt ?? ""}
                    onChange={(e) => updateSEO({ description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">Robots</Label>
                    <div className="flex items-center gap-3">
                      <Switch
                        id="robots-index"
                        checked={draft.seo?.robots?.index ?? true}
                        onCheckedChange={(v) =>
                          updateSEO({ robots: { index: !!v, follow: draft.seo?.robots?.follow ?? true } })
                        }
                      />
                      <Label htmlFor="robots-index" className="text-white">
                        index
                      </Label>
                      <Switch
                        id="robots-follow"
                        checked={draft.seo?.robots?.follow ?? true}
                        onCheckedChange={(v) =>
                          updateSEO({ robots: { index: draft.seo?.robots?.index ?? true, follow: !!v } })
                        }
                      />
                      <Label htmlFor="robots-follow" className="text-white">
                        follow
                      </Label>
                    </div>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Open Graph type</Label>
                    <Select
                      value={draft.seo?.ogType || "article"}
                      onValueChange={(v) => updateSEO({ ogType: v as BlogSEO["ogType"] })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="article" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">article</SelectItem>
                        <SelectItem value="website">website</SelectItem>
                        <SelectItem value="video.other">video.other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Twitter card</Label>
                    <Select
                      value={draft.seo?.twitterCard || "summary_large_image"}
                      onValueChange={(v) => updateSEO({ twitterCard: v as BlogSEO["twitterCard"] })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="summary_large_image" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary_large_image">summary_large_image</SelectItem>
                        <SelectItem value="summary">summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ImagePicker
                  label="Image Open Graph (facultatif)"
                  value={draft.seo?.ogImage || ""}
                  onChange={(v) => updateSEO({ ogImage: v || undefined })}
                  hint="Par défaut, l’image de couverture est utilisée"
                />

                <div>
                  <Label className="text-white mb-2 block">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                      placeholder="Ajouter un tag et appuyer sur Entrée"
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/30 text-white bg-transparent"
                      onClick={addTag}
                    >
                      Ajouter
                    </Button>
                  </div>
                  {draft.seo?.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {draft.seo.tags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-2">
                          <Badge className="bg-white/10 text-white border-white/20">{t}</Badge>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeTag(t)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* SEO Preview */}
                <div className="rounded-lg border border-white/10 p-4 bg-black/20">
                  <p className="text-xs text-white/50 mb-2">Aperçu Google</p>
                  <p className="text-[#8ab4f8] text-lg leading-tight">{seoTitle || "Titre de l’article"}</p>
                  <p className="text-[#bdc1c6] text-sm">
                    {draft?.seo?.canonicalUrl || "https://votre-domaine.com/eside-culture/slug"}
                  </p>
                  <p className="text-[#9aa0a6] text-sm mt-1">
                    {seoDescription || "Votre meta description s’affichera ici (70–160 caractères)."}
                  </p>
                  <p className="mt-2 text-xs">
                    <span className={titleOk ? "text-green-400" : "text-yellow-300"}>Titre: {titleLen}/60</span>
                    {" • "}
                    <span className={descOk ? "text-green-400" : "text-yellow-300"}>Description: {descLen}/160</span>
                    {" • "}
                    <span className="text-white/70">{minutes} min de lecture</span>
                  </p>
                </div>
              </div>

              {/* Blocks */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="bg-white/10 hover:bg-white/20"
                    variant="outline"
                    onClick={() => addBlock("paragraph")}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Paragraphe
                  </Button>
                  <Button className="bg-white/10 hover:bg-white/20" variant="outline" onClick={() => addBlock("image")}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                  <Button className="bg-white/10 hover:bg-white/20" variant="outline" onClick={() => addBlock("video")}>
                    <Video className="w-4 h-4 mr-2" />
                    Vidéo
                  </Button>
                  <Button className="bg-white/10 hover:bg-white/20" variant="outline" onClick={() => addBlock("embed")}>
                    <Code2 className="w-4 h-4 mr-2" />
                    Code embarqué
                  </Button>
                </div>

                <div className="space-y-4">
                  {draft.blocks.map((b, i) => (
                    <div key={`block-${i}`} className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-600/80 text-white">{b.type}</Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/30 bg-transparent text-white"
                            onClick={() => moveBlock(i, -1)}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/30 bg-transparent text-white"
                            onClick={() => moveBlock(i, 1)}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeBlock(i)}>
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
                            className="min-h-[120px] p-3 rounded-md bg-white/10 border border_white/20 outline-none text-white"
                            onBlur={() => syncParagraphHtml(i)}
                            dangerouslySetInnerHTML={{ __html: (b as any).html }}
                          />
                          <p className="text-xs text-white/50">Astuce: utilisez la barre d’outils pour formater.</p>
                        </div>
                      )}

                      {b.type === "image" && (
                        <div className="space-y-2">
                          <ImagePicker
                            value={(b as any).src}
                            onChange={(v) => {
                              const arr = [...draft.blocks]
                              ;(arr[i] as any).src = v || ""
                              updateDraft({ blocks: arr })
                            }}
                            hint="PNG/JPG/WEBP — Import local ou URL"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <Label className="text-white text-sm">Texte alternatif (alt)</Label>
                              <Input
                                value={(b as any).alt || ""}
                                onChange={(e) => {
                                  const arr = [...draft.blocks]
                                  ;(arr[i] as any).alt = e.target.value
                                  updateDraft({ blocks: arr })
                                }}
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-white text-sm">Légende</Label>
                              <Input
                                value={(b as any).caption || ""}
                                onChange={(e) => {
                                  const arr = [...draft.blocks]
                                  ;(arr[i] as any).caption = e.target.value
                                  updateDraft({ blocks: arr })
                                }}
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {b.type === "video" && (
                        <div className="space-y-2">
                          <div>
                            <Label className="text-white text-sm">URL vidéo (YouTube, Vimeo ou .mp4)</Label>
                            <Input
                              value={(b as any).url}
                              onChange={(e) => {
                                const arr = [...draft.blocks]
                                ;(arr[i] as any).url = e.target.value
                                updateDraft({ blocks: arr })
                              }}
                              className="bg-white/10 border-white/20 text-white"
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                          </div>
                          <div>
                            <Label className="text-white text-sm">Légende</Label>
                            <Input
                              value={(b as any).caption || ""}
                              onChange={(e) => {
                                const arr = [...draft.blocks]
                                ;(arr[i] as any).caption = e.target.value
                                updateDraft({ blocks: arr })
                              }}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                        </div>
                      )}

                      {b.type === "embed" && (
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Code à embarquer (HTML)</Label>
                          <Textarea
                            value={(b as any).html}
                            onChange={(e) => {
                              const arr = [...draft.blocks]
                              ;(arr[i] as any).html = e.target.value
                              updateDraft({ blocks: arr })
                            }}
                            className="bg-white/10 border-white/20 text-white min-h-[120px]"
                          />
                          <div>
                            <Label className="text-white text-sm">Légende</Label>
                            <Input
                              value={(b as any).caption || ""}
                              onChange={(e) => {
                                const arr = [...draft.blocks]
                                ;(arr[i] as any).caption = e.target.value
                                updateDraft({ blocks: arr })
                              }}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <p className="text-xs text-white/50">
                            Attention: contenu potentiellement non sécurisé. Ne collez que des embeds de confiance.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={commitEdit} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
