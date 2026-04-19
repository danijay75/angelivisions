"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, ImageIcon as ImageIconLucide, Calendar, Users as UsersIcon, MapPin, RefreshCw, Tag, ListChecks } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ImagePicker from "@/components/admin/image-picker"
import ImageGallery from "@/components/admin/image-gallery"
import VideoUpload from "@/components/admin/video-upload"
import RichTextEditor from "@/components/admin/rich-text-editor"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    linkedinUrl?: string
    videos?: string[]
}

const slugify = (str: string) => {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export default function ProjectsManager() {
    const { user } = useAuth()
    const [projects, setProjects] = useState<Project[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [availableServices, setAvailableServices] = useState<any[]>([])
    const [serviceInput, setServiceInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Edit State
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState<Partial<Project>>({})

    const canEdit = user?.role === "admin" || user?.role === "editor"

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [projRes, catRes, servRes] = await Promise.all([
                fetch("/api/projects"),
                fetch("/api/categories"),
                fetch("/api/services")
            ])

            if (projRes.ok) {
                const data = await projRes.json()
                setProjects(data.projects || [])
            }

            if (catRes.ok) {
                const data = await catRes.json()
                setCategories(data.categories || [])
            }

            if (servRes.ok) {
                const data = await servRes.json()
                setAvailableServices(data.services || [])
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

    const addServiceTag = (service: string) => {
        const trimmed = service.trim()
        if (!trimmed) return

        const currentServices = formData.services || []
        if (!currentServices.includes(trimmed)) {
            updateFormData("services", [...currentServices, trimmed])
        }
        setServiceInput("")
    }

    const removeServiceTag = (service: string) => {
        const currentServices = formData.services || []
        updateFormData("services", currentServices.filter(s => s !== service))
    }

    const handleSave = async () => {
        if (!formData.title) return alert("Le titre est requis")

        // Auto-generate ID/Slug
        const generatedSlug = slugify(formData.title);
        const id = typeof formData.id === "string" && formData.id.trim() !== "" ? formData.id : generatedSlug;
        const slug = generatedSlug; // Force slug to align with current title

        const finalProject = {
            ...formData,
            id,
            slug,
            image: formData.image || "",
            gallery: formData.gallery || [],
            services: formData.services || [],
            videos: formData.videos || []
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
                            <h2 className="text-2xl font-bold text-white">Réalisations ({projects.length})</h2>
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
                        <div className="space-y-2">
                            <Label className="text-white">Titre du projet</Label>
                            <Input
                                value={formData.title || ""}
                                onChange={e => updateFormData("title", e.target.value)}
                                className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                                placeholder="Ex: Lancement Produit X"
                            />
                            {formData.title && (
                                <p className="text-xs text-white/50 mt-1 pl-1">
                                    Lien : <span className="text-purple-400">/projet/{slugify(formData.title)}</span>
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-white">Date de l'événement</Label>
                                <Input
                                    value={formData.date || ""}
                                    onChange={e => updateFormData("date", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                                    placeholder="Ex: Octobre 2024"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Catégorie de services</Label>
                                <Select
                                    value={formData.category || ""}
                                    onValueChange={v => updateFormData("category", v)}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-purple-500">
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id} className="focus:bg-purple-600 focus:text-white">
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-white">Client</Label>
                                <Input
                                    value={formData.client || ""}
                                    onChange={e => updateFormData("client", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                                    placeholder="Ex: Entreprise Y"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Lien LinkedIn</Label>
                                <Input
                                    value={formData.linkedinUrl || ""}
                                    onChange={e => updateFormData("linkedinUrl", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                                    placeholder="Ex: https://www.linkedin.com/posts/..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-white flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-purple-400" />
                                Prestations incluses
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {(formData.services || []).map((service, idx) => (
                                    <Badge key={idx} className="bg-purple-600/30 text-purple-200 border-purple-500/50 py-1 px-2 gap-1">
                                        {service}
                                        <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => removeServiceTag(service)} />
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        value={serviceInput}
                                        onChange={e => setServiceInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addServiceTag(serviceInput)
                                            }
                                        }}
                                        className="bg-white/5 border-white/10 text-white focus:border-purple-500 pr-10"
                                        placeholder="Ex: Sonorisation, Vidéo Mapping..."
                                    />
                                    <button
                                        onClick={() => addServiceTag(serviceInput)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {availableServices.length > 0 && serviceInput && (
                                <div className="bg-slate-800 border border-white/10 rounded-md p-2 mt-2 max-h-40 overflow-y-auto">
                                    <p className="text-xs text-white/40 mb-2 px-2 uppercase font-bold">Suggestions de services</p>
                                    {availableServices
                                        .filter(s => s.title.toLowerCase().includes(serviceInput.toLowerCase()))
                                        .map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => addServiceTag(s.title)}
                                                className="w-full text-left px-2 py-1.5 text-sm text-white/80 hover:bg-white/10 rounded transition-colors flex items-center gap-2"
                                            >
                                                <Tag className="w-3 h-3 text-purple-400" />
                                                {s.title}
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Description</Label>
                            <RichTextEditor
                                content={formData.description || ""}
                                onChange={v => updateFormData("description", v)}
                            />
                        </div>

                        <ImagePicker
                            label="Image de couverture (Vignette projet)"
                            value={formData.image || ""}
                            onChange={(val) => updateFormData("image", val || "")}
                        />

                        <ImageGallery
                            label="Galerie de photos"
                            images={formData.gallery || []}
                            onImagesChange={(imgs) => updateFormData("gallery", imgs)}
                        />

                        <VideoUpload
                            label="Vidéos du projet"
                            videos={formData.videos || []}
                            onVideosChange={(vids) => updateFormData("videos", vids)}
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
