"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, Shield, Check, UserCircle } from "lucide-react"

interface User {
    id: string
    name: string
    email: string
    role: "admin" | "editor" | "guest"
    active: boolean
    createdAt: string
    updatedAt: string
}

export default function UsersManager() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<User | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState<Partial<User & { password?: string }>>({})
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    async function loadUsers() {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/users")
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (error) {
            console.error("Error loading users:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadUsers()
    }, [])

    const startCreate = () => {
        setIsCreating(true)
        setEditing(null)
        setFormData({ name: "", email: "", role: "editor", active: true, password: "" })
        setMessage(null)
    }

    const startEdit = (user: User) => {
        setEditing(user)
        setIsCreating(false)
        setFormData({ ...user, password: "" })
        setMessage(null)
    }

    const cancel = () => {
        setEditing(null)
        setIsCreating(false)
        setFormData({})
        setMessage(null)
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setMessage(null)

        if (!formData.name || !formData.email || (isCreating && !formData.password)) {
            setMessage({ type: "error", text: "Veuillez remplir tous les champs requis." })
            return
        }

        try {
            const url = isCreating ? "/api/admin/users" : `/api/admin/users/${editing?.id}`
            const method = isCreating ? "POST" : "PUT"

            const payload = { ...formData }
            if (!payload.password) delete payload.password

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const result = await res.json()

            if (res.ok) {
                setMessage({ type: "success", text: isCreating ? "Utilisateur créé avec succès." : "Utilisateur mis à jour." })
                await loadUsers()
                if (isCreating) cancel()
            } else {
                setMessage({ type: "error", text: result.error || "Une erreur est survenue." })
            }
        } catch (error) {
            setMessage({ type: "error", text: "Erreur de connexion au serveur." })
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
            if (res.ok) {
                setUsers(users.filter((u) => u.id !== id))
                setMessage({ type: "success", text: "Utilisateur supprimé." })
            } else {
                const result = await res.json()
                setMessage({ type: "error", text: result.error || "Suppression impossible." })
            }
        } catch (error) {
            setMessage({ type: "error", text: "Erreur de connexion au serveur." })
        }
    }

    return (
        <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Gestion des Administrateurs
                </CardTitle>
                <Button
                    onClick={startCreate}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel Utilisateur
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {message && (
                    <div className={`p-3 rounded-lg border ${message.type === "success"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                        : "bg-red-500/20 border-red-500/50 text-red-200"
                        }`}>
                        {message.text}
                    </div>
                )}

                {(isCreating || editing) && (
                    <form onSubmit={handleSave} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                        <h3 className="text-white font-medium">
                            {isCreating ? "Créer un nouvel utilisateur" : `Modifier ${editing?.name}`}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-white">Nom Complet</Label>
                                <Input
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white/10 border-white/20 text-white"
                                    placeholder="Jean Dupont"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-white/10 border-white/20 text-white"
                                    placeholder="jean@angelivisions.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">Rôle</Label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                    className="w-full h-10 px-3 bg-white/10 border border-white/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="admin" className="bg-slate-900">Administrateur</option>
                                    <option value="editor" className="bg-slate-900">Éditeur</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white">
                                    Mot de passe {editing && <span className="text-slate-400 text-xs">(laisser vide pour ne pas changer)</span>}
                                </Label>
                                <Input
                                    type="password"
                                    value={formData.password || ""}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-white/10 border-white/20 text-white"
                                    placeholder="••••••••"
                                    required={isCreating}
                                />
                            </div>
                            <div className="flex items-center gap-3 py-4 md:col-span-2">
                                <input
                                    type="checkbox"
                                    id="user-active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                                />
                                <Label htmlFor="user-active" className="text-white cursor-pointer select-none">Compte actif</Label>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                <Save className="w-4 h-4 mr-2" />
                                Enregistrer
                            </Button>
                            <Button type="button" onClick={cancel} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                Annuler
                            </Button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-white/10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-slate-400 text-sm">
                                    <th className="p-4 font-medium">Utilisateur</th>
                                    <th className="p-4 font-medium">Rôle</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="text-white hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <UserCircle className="w-8 h-8 text-slate-400" />
                                                <div>
                                                    <p className="font-medium">{String(user.name || "")}</p>
                                                    <p className="text-xs text-slate-400">{String(user.email || "")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={user.role === "admin" ? "bg-purple-600/80" : "bg-blue-600/80"}>
                                                {String(user.role === "admin" ? "Admin" : "Éditeur")}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            {user.active ? (
                                                <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                                                    <Check className="w-4 h-4" /> Actif
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                                    <X className="w-4 h-4" /> Inactif
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => startEdit(user)} className="hover:bg-blue-500/20 text-blue-400">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(user.id)} className="hover:bg-red-500/20 text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
