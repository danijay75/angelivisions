"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X, Music, Video, Tag, Check, ArrowUp, ArrowDown, Link } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ImagePicker from "@/components/admin/image-picker"
import type { Artist, LocalizedString } from "@/data/artists"

export default function ArtistsManager() {
    const { user } = useAuth()
    const [artists, setArtists] = useState<Artist[]>([])
    const [loading, setLoading] = useState(true)
    const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState<Partial<Artist>>({})

    // Temp form states for new items
    const [newType, setNewType] = useState("")
    const [newGenre, setNewGenre] = useState("")
    const [newVideoUrl, setNewVideoUrl] = useState("")
    const [newSocialPlatform, setNewSocialPlatform] = useState("Instagram")
    const [newSocialUrl, setNewSocialUrl] = useState("")

    const canEdit = user?.role === "admin" || user?.role === "editor"

    const ARTIST_TYPES = ["DJ", "Musicien(ne)", "Groupe", "Orchestre", "Reprises", "Performer"]
    const DEFAULT_MUSICAL_GENRES = ["Hip-Hop", "Pop", "Electro-House", "Rock", "Latino", "Jazz", "Classique"]
    const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "X", "YouTube", "TikTok", "Spotify", "Apple Music", "SoundCloud"]

    const loadArtists = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/artists")
            if (res.ok) {
                const data = await res.json()
                setArtists(data.artists || [])
            }
        } catch (error) {
            console.error("Failed to load artists", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadArtists()
    }, [])

    const handleEdit = (artist: Artist) => {
        setEditingArtist(artist)
        setFormData({ ...artist, type: artist.type || [], musicalGenre: artist.musicalGenre || [], socials: artist.socials || [], videos: artist.videos || [] })
        setIsCreating(false)
    }

    const handleCreate = () => {
        setEditingArtist(null)
        setFormData({
            name: "",
            type: [],
            musicalGenre: [],
            description: { fr: "", en: "", es: "" },
            photos: [],
            videos: [],
            socials: [],
            tags: [],
            available: true,
            featured: false,
            order: artists.length > 0 ? Math.max(...artists.map(a => a.order || 0)) + 1 : 1
        })
        setIsCreating(true)
    }

    const handleSave = async () => {
        if (!formData.name) return alert("Le nom est requis")

        const method = editingArtist ? "PUT" : "POST"
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

        const finalData = {
            ...formData,
            slug
        }

        try {
            const res = await fetch("/api/artists", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData)
            })

            if (res.ok) {
                setIsCreating(false)
                setEditingArtist(null)
                loadArtists()
            } else {
                const err = await res.json()
                alert(err.error || "Une erreur est survenue")
            }
        } catch (error) {
            alert("Erreur de connexion")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cet artiste ?")) return
        try {
            const res = await fetch(`/api/artists?id=${id}`, { method: "DELETE" })
            if (res.ok) loadArtists()
        } catch (error) {
            alert("Erreur de suppression")
        }
    }

    const handleImageChange = (index: number, value: string | undefined) => {
        const photos = [...(formData.photos || [])]
        if (value) {
            if (index >= photos.length) photos.push(value)
            else photos[index] = value
        } else {
            photos.splice(index, 1)
        }
        setFormData(prev => ({ ...prev, photos }))
    }

    // List helpers
    const addType = () => {
        if (!newType.trim()) return
        const t = [...(formData.type || [])]
        if (!t.some(x => x.fr.toLowerCase() === newType.toLowerCase())) {
            t.push({ fr: newType, en: newType, es: newType })
            setFormData(prev => ({ ...prev, type: t }))
        }
        setNewType("")
    }

    const removeType = (index: number) => {
        const t = [...(formData.type || [])]
        t.splice(index, 1)
        setFormData(prev => ({ ...prev, type: t }))
    }

    const addGenre = () => {
        if (!newGenre.trim()) return
        const g = [...(formData.musicalGenre || [])]
        if (!g.some(x => x.fr.toLowerCase() === newGenre.toLowerCase())) {
            g.push({ fr: newGenre, en: newGenre, es: newGenre })
            setFormData(prev => ({ ...prev, musicalGenre: g }))
        }
        setNewGenre("")
    }

    const removeGenre = (index: number) => {
        const g = [...(formData.musicalGenre || [])]
        g.splice(index, 1)
        setFormData(prev => ({ ...prev, musicalGenre: g }))
    }

    const addVideo = () => {
        if (!newVideoUrl.trim()) return
        const v = [...(formData.videos || [])]
        v.push(newVideoUrl)
        setFormData(prev => ({ ...prev, videos: v }))
        setNewVideoUrl("")
    }

    const removeVideo = (index: number) => {
        const v = [...(formData.videos || [])]
        v.splice(index, 1)
        setFormData(prev => ({ ...prev, videos: v }))
    }

    const addSocial = () => {
        if (!newSocialUrl.trim()) return
        const s = [...(formData.socials || [])]
        s.push({ platform: newSocialPlatform, url: newSocialUrl })
        setFormData(prev => ({ ...prev, socials: s }))
        setNewSocialUrl("")
    }

    const removeSocial = (index: number) => {
        const s = [...(formData.socials || [])]
        s.splice(index, 1)
        setFormData(prev => ({ ...prev, socials: s }))
    }

    if (loading) return <div className="text-white/50 text-center p-8">Chargement des artistes...</div>

    return (
        <div className="space-y-6">
            {!isCreating && !editingArtist ? (
                <>
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-xl border border-white/10">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Gestion des Artistes</h2>
                            <p className="text-white/50 text-sm">Ajoutez et modifiez les artistes de votre catalogue</p>
                        </div>
                        <Button onClick={handleCreate} disabled={!canEdit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Ajouter un Artiste
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {artists.map((artist) => (
                            <Card key={artist.id} className="bg-slate-900 border-white/10 overflow-hidden group">
                                <div className="relative h-48 bg-slate-800">
                                    {artist.photos[0] ? (
                                        <img src={artist.photos[0]} alt={artist.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            <Music className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        {artist.featured && <Badge className="bg-amber-500 text-white">Vedette</Badge>}
                                        {!artist.available && <Badge variant="destructive">Indisponible</Badge>}
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="text-white font-bold text-lg mb-1">{artist.name}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {artist.type?.slice(0, 2).map((t, i) => (
                                            <Badge key={i} variant="outline" className="text-emerald-400 border-emerald-400/30 text-[10px]">{t.fr}</Badge>
                                        ))}
                                        {artist.musicalGenre?.slice(0, 2).map((g, i) => (
                                            <Badge key={i} variant="outline" className="text-teal-400 border-teal-400/30 text-[10px]">{g.fr}</Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10" onClick={() => handleEdit(artist)}>
                                            <Edit className="w-3 h-3 mr-2" /> Modifier
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(artist.id || "")}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <Card className="bg-slate-900 border-white/10 w-full max-w-5xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            {isCreating ? <Plus className="w-5 h-5 text-emerald-400" /> : <Edit className="w-5 h-5 text-emerald-400" />}
                            {isCreating ? "Nouvel Artiste" : `Modifier ${formData.name}`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-2">
                            <Label className="text-white">Nom de l'artiste</Label>
                            <Input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-white/5 border-white/10 text-white max-w-sm" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Types */}
                            <div className="space-y-4">
                                <Label className="text-white">Types d'Artiste (FR)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.type?.map((t, i) => (
                                        <Badge key={i} className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                            {t.fr}
                                            <button onClick={() => removeType(i)} className="hover:text-emerald-100"><X className="w-3 h-3" /></button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input value={newType} onChange={e => setNewType(e.target.value)} placeholder="Ajouter un type..." className="bg-white/5 border-white/10 text-white" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addType(); } }} />
                                    <Button type="button" onClick={addType} className="bg-white/10 text-white hover:bg-white/20"><Plus className="w-4 h-4" /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {ARTIST_TYPES.map(preset => (
                                        <Button key={preset} type="button" variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white" onClick={() => { setNewType(preset); }}>{preset}</Button>
                                    ))}
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="space-y-4">
                                <Label className="text-white">Genres Musicaux (FR)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.musicalGenre?.map((g, i) => (
                                        <Badge key={i} className="bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                                            {g.fr}
                                            <button onClick={() => removeGenre(i)} className="hover:text-teal-100"><X className="w-3 h-3" /></button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input value={newGenre} onChange={e => setNewGenre(e.target.value)} placeholder="Ajouter un genre..." className="bg-white/5 border-white/10 text-white" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGenre(); } }} />
                                    <Button type="button" onClick={addGenre} className="bg-white/10 text-white hover:bg-white/20"><Plus className="w-4 h-4" /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {DEFAULT_MUSICAL_GENRES.map(preset => (
                                        <Button key={preset} type="button" variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white" onClick={() => { setNewGenre(preset); }}>{preset}</Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Description FR (HTML accepté)</Label>
                            <Textarea
                                value={formData.description?.fr || ""}
                                onChange={e => {
                                    const currentDesc = formData.description || { fr: "", en: "", es: "" };
                                    setFormData({ ...formData, description: { ...currentDesc, fr: e.target.value } });
                                }}
                                className="bg-white/5 border-white/10 text-white h-32"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-white/10 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Switch checked={formData.available} onCheckedChange={v => setFormData({ ...formData, available: v })} />
                                <Label className="text-white">Disponible à la réservation</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch checked={formData.featured} onCheckedChange={v => setFormData({ ...formData, featured: v })} />
                                <Label className="text-white">Mettre en avant (Vedette)</Label>
                            </div>
                        </div>

                        {/* Vidéos */}
                        <div className="space-y-4">
                            <Label className="text-white flex items-center gap-2"><Video className="w-4 h-4" /> Vidéos (URLs YouTube)</Label>
                            <div className="space-y-2">
                                {formData.videos?.map((vid, i) => (
                                    <div key={i} className="flex gap-2 items-center bg-white/5 border border-white/10 p-2 rounded">
                                        <code className="text-xs text-emerald-300 flex-1 truncate">{vid}</code>
                                        <Button variant="ghost" size="sm" onClick={() => removeVideo(i)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 max-w-lg">
                                <Input value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="bg-white/5 border-white/10 text-white" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addVideo(); } }} />
                                <Button type="button" onClick={addVideo} className="bg-white/10 text-white hover:bg-white/20">Ajouter</Button>
                            </div>
                        </div>

                        {/* Réseaux Sociaux */}
                        <div className="space-y-4">
                            <Label className="text-white flex items-center gap-2"><Link className="w-4 h-4" /> Réseaux Sociaux</Label>
                            <div className="space-y-2">
                                {formData.socials?.map((soc, i) => (
                                    <div key={i} className="flex gap-2 items-center bg-white/5 border border-white/10 p-2 rounded">
                                        <Badge variant="outline" className="border-white/20 text-white w-24 justify-center">{soc.platform}</Badge>
                                        <code className="text-xs text-blue-300 flex-1 truncate">{soc.url}</code>
                                        <Button variant="ghost" size="sm" onClick={() => removeSocial(i)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 max-w-lg">
                                <Select value={newSocialPlatform} onValueChange={setNewSocialPlatform}>
                                    <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {SOCIAL_PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Input value={newSocialUrl} onChange={e => setNewSocialUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-white/5 border-white/10 text-white" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSocial(); } }} />
                                <Button type="button" onClick={addSocial} className="bg-white/10 text-white hover:bg-white/20">Ajouter</Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-white">Photos</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[0, 1, 2, 3].map(i => (
                                    <ImagePicker key={i} label={`Photo ${i + 1}`} value={formData.photos?.[i]} onChange={v => handleImageChange(i, v)} />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                                <Save className="w-4 h-4 mr-2" /> {isCreating ? "Créer l'artiste" : "Enregistrer"}
                            </Button>
                            <Button variant="outline" onClick={() => { setIsCreating(false); setEditingArtist(null) }} className="border-white/10 text-white hover:bg-white/5">
                                Annuler
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}


