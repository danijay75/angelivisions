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
import { Plus, Edit, Trash2, Save, X, Music, Video, Tag, Check, ArrowUp, ArrowDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ImagePicker from "@/components/admin/image-picker"
import type { Artist } from "@/data/artists"

export default function ArtistsManager() {
    const { user } = useAuth()
    const [artists, setArtists] = useState<Artist[]>([])
    const [loading, setLoading] = useState(true)
    const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState<Partial<Artist>>({})

    const canEdit = user?.role === "admin" || user?.role === "editor"

    const ARTIST_TYPES = ["DJ", "Musicien(ne)", "Groupe", "Orchestre", "Reprises", "Performer"]
    const DEFAULT_MUSICAL_GENRES = ["Hip-Hop", "Pop", "Electro-House", "Rock", "Latino", "Jazz", "Classique"]

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
        setFormData({ ...artist })
        setIsCreating(false)
    }

    const handleCreate = () => {
        setEditingArtist(null)
        setFormData({
            name: "",
            type: "DJ",
            musicalGenre: "Pop",
            description: "",
            photos: [],
            videos: [],
            tags: [],
            available: true,
            featured: false,
            order: artists.length > 0 ? Math.max(...artists.map(a => a.order)) + 1 : 1
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

    const toggleTag = (tag: string) => {
        const tags = [...(formData.tags || [])]
        const index = tags.indexOf(tag)
        if (index === -1) tags.push(tag)
        else tags.splice(index, 1)
        setFormData(prev => ({ ...prev, tags }))
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
                                    <div className="flex gap-2 mb-4">
                                        <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 text-[10px]">{artist.type}</Badge>
                                        <Badge variant="outline" className="text-teal-400 border-teal-400/30 text-[10px]">{artist.musicalGenre}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10" onClick={() => handleEdit(artist)}>
                                            <Edit className="w-3 h-3 mr-2" /> Modifier
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(artist.id)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <Card className="bg-slate-900 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            {isCreating ? <Plus className="w-5 h-5 text-emerald-400" /> : <Edit className="w-5 h-5 text-emerald-400" />}
                            {isCreating ? "Nouvel Artiste" : `Modifier ${formData.name}`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-white">Nom de l'artiste</Label>
                                <Input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Type d'Artiste</Label>
                                <Select value={formData.type || "DJ"} onValueChange={v => setFormData({ ...formData, type: v })}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {ARTIST_TYPES.map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Genre Musical</Label>
                                <Select value={formData.musicalGenre || "Pop"} onValueChange={v => setFormData({ ...formData, musicalGenre: v })}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Sélectionner un genre" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {DEFAULT_MUSICAL_GENRES.map(g => (
                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Description (HTML accepté)</Label>
                            <Textarea value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-white/5 border-white/10 text-white h-32" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-2">
                                <Switch checked={formData.available} onCheckedChange={v => setFormData({ ...formData, available: v })} />
                                <Label className="text-white">Disponible à la réservation</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch checked={formData.featured} onCheckedChange={v => setFormData({ ...formData, featured: v })} />
                                <Label className="text-white">Mettre en avant (Vedette)</Label>
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

                        <div className="flex gap-4">
                            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                                <Save className="w-4 h-4 mr-2" /> Enregistrer
                            </Button>
                            <Button variant="outline" onClick={() => { setIsCreating(false); setEditingArtist(null) }} className="border-white/10 text-white">
                                Annuler
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
