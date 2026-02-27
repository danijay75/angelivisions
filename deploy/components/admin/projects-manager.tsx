"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, ImageIcon as ImageIconLucide, Calendar, Users as UsersIcon, MapPin, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ImagePicker from "@/components/admin/image-picker"
// Removed unused CategoryManager import to fix build error
// import CategoryManager from "@/components/admin/category-manager"

// Define interfaces locally to avoid import issues from missing files
interface Project {
    id: string
    title: string
    slug: string
    description: string
    fullDescription?: string
    client: string
    date: string
    guests: string
    location: string
    image: string
    gallery?: string[]
    services?: string[]
    category?: string
}

interface ImageUploadProps {
    images: string[]
    onImagesChange: (images: string[]) => void
    maxImages?: number
    label?: string
}

function ImageUpload({ images, onImagesChange, maxImages = 1, label }: ImageUploadProps) {
    const handleChange = (index: number, value: string | undefined) => {
        const newImages = [...images]
        if (value) {
            if (index >= newImages.length) {
                newImages.push(value)
            } else {
                newImages[index] = value
            }
        } else {
            newImages.splice(index, 1)
        }
        onImagesChange(newImages)
    }

    return (
        <div className="space-y-4">
            {label && <Label className="text-white block mb-2">{label}</Label>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img, index) => (
                    <ImagePicker
                        key={index}
                        label={`Image ${index + 1}`}
                        value={img}
                        onChange={(v) => handleChange(index, v)}
                    />
                ))}
                {images.length < maxImages && (
                    <ImagePicker
                        label={`Nouvelle image`}
                        value={undefined}
                        onChange={(v) => handleChange(images.length, v)}
                    />
                )}
            </div>
        </div>
    )
}

export default function ProjectsManager() {
    const { user } = useAuth()
    const [projects, setProjects] = useState<Project[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Edit State
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState<Partial<Project>>({})

    const canEdit = user?.role === "admin" || user?.role === "editor"

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [projRes, catRes] = await Promise.all([
                fetch("/api/projects"),
                fetch("/api/categories")
            ])

            if (projRes.ok) {
                const data = await projRes.json()
                setProjects(data.projects || [])
            }

            if (catRes.ok) {
                const data = await catRes.json()
                setCategories(data.categories || [])
            }
        } catch (error) {
            console.error("Failed to load data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleCreate = () => {
        setEditingProject(null)
        setFormData({})
        setIsCreating(true)
    }

    const handleEdit = (project: Project) => {
        setEditingProject(project)
        setFormData({ ...project })
        setIsCreating(false)
    }

    const updateFormData = (key: keyof Project, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        if (!formData.title) return alert("Le titre est requis")

        // Auto-generate ID/Slug if missing
        const id = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        const slug = formData.slug || id

        const finalProject = {
            ...formData,
            id,
            slug,
            image: formData.image || "",
            gallery: formData.gallery || [],
            services: formData.services || []
        }

        // Optimistic Update
        const newProjects = editingProject
            ? projects.map(p => p.id === editingProject.id ? finalProject as Project : p)
            : [...projects, finalProject as Project]

        setProjects(newProjects)

        // API Call
        try {
            await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projects: newProjects })
            })
            setIsCreating(false)
            setEditingProject(null)
        } catch (e) {
            alert("Erreur lors de la sauvegarde")
            loadData()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce projet ?")) return
        const newProjects = projects.filter(p => p.id !== id)
        setProjects(newProjects)
        await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projects: newProjects })
        })
    }

    if (isLoading) return <div className="text-white/50 text-center p-8">Chargement des projets...</div>

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* List View */}
            {!isCreating && !editingProject && (
                <>
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-xl border border-white/10">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Projets ({projects.length})</h2>
                            <p className="text-white/50 text-sm">Gérez vos réalisations et études de cas</p>
                        </div>
                        <Button onClick={handleCreate} disabled={!canEdit} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all">
                            <Plus className="w-4 h-4 mr-2" /> Nouveau Projet
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <Card className="bg-slate-900 border-white/10 overflow-hidden h-full flex flex-col hover:border-purple-500/50 transition-colors">
                                    <div className="relative h-48 bg-slate-800">
                                        {project.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={project.image}
                                                alt={String(project.title || "Projet")}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                <ImageIconLucide className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <h3 className="text-white font-bold text-lg leading-tight shadow-black drop-shadow-md">{String(project.title)}</h3>
                                            <p className="text-white/70 text-xs">{String(project.client)}</p>
                                        </div>
                                    </div>

                                    <CardContent className="p-4 flex-1 flex flex-col gap-4">
                                        <p className="text-white/60 text-sm line-clamp-2 flex-1">{String(project.description)}</p>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
                                            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {String(project.date)}</div>
                                            <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {String(project.location)}</div>
                                        </div>

                                        <div className="flex gap-2 pt-2 border-t border-white/5">
                                            <Button size="sm" variant="secondary" className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10" onClick={() => handleEdit(project)}>
                                                <Edit className="w-3 h-3 mr-2" /> Modifier
                                            </Button>
                                            <Button size="sm" variant="destructive" className="px-2" onClick={() => handleDelete(project.id)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {/* Edit/Create Form */}
            {(isCreating || editingProject) && (
                <Card className="bg-slate-900 border-white/10">
                    <CardHeader className="border-b border-white/10">
                        <CardTitle className="text-white flex items-center gap-2">
                            {isCreating ? <Plus className="w-5 h-5 text-purple-400" /> : <Edit className="w-5 h-5 text-purple-400" />}
                            {isCreating ? "Créer un nouveau projet" : `Modifier "${editingProject?.title}"`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-white">Titre du projet</Label>
                                <Input
                                    value={formData.title || ""}
                                    onChange={e => updateFormData("title", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                                    placeholder="Ex: Lancement Produit X"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Client</Label>
                                <Input
                                    value={formData.client || ""}
                                    onChange={e => updateFormData("client", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                                    placeholder="Ex: Entreprise Y"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Description courte</Label>
                            <Textarea
                                value={formData.description || ""}
                                onChange={e => updateFormData("description", e.target.value)}
                                className="bg-white/5 border-white/10 text-white focus:border-purple-500 h-20"
                            />
                        </div>

                        <ImageUpload
                            label="Image de couverture"
                            images={formData.image ? [formData.image] : []}
                            onImagesChange={(imgs) => updateFormData("image", imgs[0] || "")}
                        />

                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                                <Save className="w-4 h-4 mr-2" /> Enregistrer
                            </Button>
                            <Button variant="outline" onClick={() => { setIsCreating(false); setEditingProject(null) }} className="border-white/10 text-white hover:bg-white/5">
                                Annuler
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
