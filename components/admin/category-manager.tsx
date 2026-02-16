"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, Tag, AlertTriangle, Check } from "lucide-react"

interface Category {
  id: string
  label: string
  description?: string
  color: string
  projectCount: number
}

interface CategoryManagerProps {
  categories: Category[]
  onCategoriesChange: (categories: Category[]) => void
  projects: any[]
}

export default function CategoryManager({ categories, onCategoriesChange, projects }: CategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    label: "",
    description: "",
    color: "from-purple-500 to-pink-500",
  })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const colorOptions = [
    { id: "purple-pink", label: "Violet-Rose", value: "from-purple-500 to-pink-500" },
    { id: "blue-cyan", label: "Bleu-Cyan", value: "from-blue-500 to-cyan-500" },
    { id: "green-emerald", label: "Vert-Émeraude", value: "from-green-500 to-emerald-500" },
    { id: "orange-red", label: "Orange-Rouge", value: "from-orange-500 to-red-500" },
    { id: "indigo-purple", label: "Indigo-Violet", value: "from-indigo-500 to-purple-500" },
    { id: "teal-blue", label: "Sarcelle-Bleu", value: "from-teal-500 to-blue-500" },
    { id: "pink-rose", label: "Rose-Rosé", value: "from-pink-500 to-rose-500" },
    { id: "yellow-orange", label: "Jaune-Orange", value: "from-yellow-500 to-orange-500" },
  ]

  const generateId = (label: string) => {
    return label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const getProjectCount = (categoryId: string) => {
    return projects.filter((project) => project.category === categoryId).length
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({
      id: "",
      label: "",
      description: "",
      color: "from-purple-500 to-pink-500",
    })
    setIsCreating(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      id: category.id,
      label: category.label,
      description: category.description || "",
      color: category.color,
    })
    setIsCreating(false)
  }

  const handleSave = () => {
    const categoryId = formData.id || generateId(formData.label)
    const categoryData: Category = {
      id: categoryId,
      label: formData.label,
      description: formData.description,
      color: formData.color,
      projectCount: editingCategory ? getProjectCount(categoryId) : 0,
    }

    if (editingCategory) {
      // Modifier une catégorie existante
      const updatedCategories = categories.map((cat) => (cat.id === editingCategory.id ? categoryData : cat))
      onCategoriesChange(updatedCategories)
    } else {
      // Créer une nouvelle catégorie
      onCategoriesChange([...categories, categoryData])
    }

    handleCancel()
  }

  const handleDelete = (categoryId: string) => {
    const projectCount = getProjectCount(categoryId)
    if (projectCount > 0) {
      alert(`Impossible de supprimer cette catégorie car elle contient ${projectCount} projet(s).`)
      return
    }

    const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
    onCategoriesChange(updatedCategories)
    setDeleteConfirm(null)
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setIsCreating(false)
    setFormData({
      id: "",
      label: "",
      description: "",
      color: "from-purple-500 to-pink-500",
    })
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Auto-generate ID when label changes
      if (field === "label" && value && !editingCategory) {
        updated.id = generateId(value)
      }
      return updated
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 bg-transparent"
        >
          <Tag className="w-4 h-4 mr-2" />
          Gérer les catégories ({categories.length})
        </Button>
        {isOpen && (
          <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle catégorie
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Formulaire de création/édition */}
            {(isCreating || editingCategory) && (
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white mb-2 block">Nom de la catégorie</Label>
                      <Input
                        value={formData.label}
                        onChange={(e) => updateFormData("label", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="ex: Mariages"
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-2 block">ID (URL)</Label>
                      <Input
                        value={formData.id}
                        onChange={(e) => updateFormData("id", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="ex: mariages"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Description (optionnelle)</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Description de la catégorie"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Couleur</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => updateFormData("color", color.value)}
                          className={`relative p-3 rounded-lg border-2 transition-all ${
                            formData.color === color.value
                              ? "border-white scale-105"
                              : "border-white/20 hover:border-white/50"
                          }`}
                        >
                          <div className={`w-full h-8 rounded bg-gradient-to-r ${color.value}`} />
                          <p className="text-white text-xs mt-1">{color.label}</p>
                          {formData.color === color.value && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prévisualisation */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <Label className="text-white mb-2 block">Prévisualisation</Label>
                    <Badge className={`bg-gradient-to-r ${formData.color} text-white`}>
                      {formData.label || "Nom de la catégorie"}
                    </Badge>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste des catégories */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Catégories existantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const projectCount = getProjectCount(category.id)
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center space-x-4">
                          <Badge className={`bg-gradient-to-r ${category.color} text-white`}>{category.label}</Badge>
                          <div>
                            <p className="text-white font-medium">{category.label}</p>
                            {category.description && <p className="text-white/60 text-sm">{category.description}</p>}
                            <p className="text-white/40 text-xs">ID: {category.id}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-white/80 text-sm">{projectCount} projet(s)</p>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleEdit(category)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            {deleteConfirm === category.id ? (
                              <div className="flex space-x-1">
                                <Button
                                  onClick={() => handleDelete(category.id)}
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => setDeleteConfirm(null)}
                                  size="sm"
                                  variant="outline"
                                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => setDeleteConfirm(category.id)}
                                size="sm"
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700"
                                disabled={projectCount > 0}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}

                  {categories.length === 0 && (
                    <div className="text-center py-8">
                      <Tag className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60">Aucune catégorie créée</p>
                      <p className="text-white/40 text-sm">Cliquez sur "Nouvelle catégorie" pour commencer</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informations */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-200 font-medium mb-2">Informations importantes :</p>
                  <ul className="text-blue-100 space-y-1">
                    <li>• Les catégories avec des projets ne peuvent pas être supprimées</li>
                    <li>• L'ID de la catégorie est utilisé dans l'URL et ne doit pas contenir d'espaces</li>
                    <li>• La modification d'une catégorie affecte tous les projets associés</li>
                    <li>• Les couleurs aident à identifier visuellement les catégories</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
