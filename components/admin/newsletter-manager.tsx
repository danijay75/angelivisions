"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Trash2, Edit2, Check, X, Search, RefreshCw, User, CalendarDays } from "lucide-react"

interface Subscriber {
    name: string
    email: string
    subscribedAt: string
    consentGiven: boolean
}

export default function NewsletterManager() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingEmail, setEditingEmail] = useState<string | null>(null)
    const [editValue, setEditValue] = useState("")

    useEffect(() => {
        fetchSubscribers()
    }, [])

    const fetchSubscribers = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/newsletter")
            if (res.ok) {
                const data = await res.json()
                setSubscribers(data.subscribers || [])
            }
        } catch (error) {
            console.error("Error fetching subscribers:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (email: string) => {
        if (!confirm(`Supprimer ${email} de la liste ?`)) return
        try {
            const res = await fetch("/api/newsletter", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setSubscribers((prev) => prev.filter((s) => s.email !== email))
            }
        } catch (error) {
            console.error("Error deleting subscriber:", error)
        }
    }

    const handleUpdate = async (oldEmail: string) => {
        if (!editValue || !editValue.includes("@")) return
        try {
            const res = await fetch("/api/newsletter", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldEmail, newEmail: editValue }),
            })
            if (res.ok) {
                setSubscribers((prev) =>
                    prev.map((s) => (s.email === oldEmail ? { ...s, email: editValue } : s))
                )
                setEditingEmail(null)
            }
        } catch (error) {
            console.error("Error updating subscriber:", error)
        }
    }

    const formatDate = (dateStr: string): string => {
        if (!dateStr) return "—"
        try {
            return new Date(dateStr).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
        } catch {
            return "—"
        }
    }

    const filteredSubscribers = subscribers.filter(
        (s) =>
            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Gestion Newsletter</h2>
                    <p className="text-slate-400">Gérez les inscriptions de vos utilisateurs ({subscribers.length} abonnés)</p>
                </div>
                <Button onClick={fetchSubscribers} variant="outline" className="border-slate-700 text-slate-300">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualiser
                </Button>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Rechercher par nom ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg border-slate-700 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-900/50">
                                <TableRow className="border-slate-700 hover:bg-transparent">
                                    <TableHead className="text-slate-400">
                                        <User className="w-4 h-4 inline mr-1" /> Nom
                                    </TableHead>
                                    <TableHead className="text-slate-400">
                                        <Mail className="w-4 h-4 inline mr-1" /> Email
                                    </TableHead>
                                    <TableHead className="text-slate-400">
                                        <CalendarDays className="w-4 h-4 inline mr-1" /> Date
                                    </TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            Chargement des abonnés...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredSubscribers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            Aucun abonné trouvé.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSubscribers.map((sub) => (
                                        <TableRow key={sub.email} className="border-slate-700 hover:bg-white/5">
                                            <TableCell className="text-slate-200">
                                                {sub.name ? String(sub.name) : <span className="text-slate-500 italic text-xs">Non renseigné</span>}
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-200">
                                                {editingEmail === sub.email ? (
                                                    <Input
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="bg-slate-900 border-blue-500 text-white h-8 max-w-sm"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="w-3.5 h-3.5 mr-2.5 text-slate-500" />
                                                        {String(sub.email)}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">
                                                {formatDate(String(sub.subscribedAt))}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    {editingEmail === sub.email ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-green-400 hover:text-green-300 hover:bg-green-400/10 h-8 w-8 p-0"
                                                                onClick={() => handleUpdate(sub.email)}
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-slate-400 hover:text-slate-300 hover:bg-slate-400/10 h-8 w-8 p-0"
                                                                onClick={() => setEditingEmail(null)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-white/40 hover:text-blue-400 hover:bg-blue-400/10 h-8 w-8 p-0"
                                                                onClick={() => {
                                                                    setEditingEmail(sub.email)
                                                                    setEditValue(sub.email)
                                                                }}
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-white/40 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                                                                onClick={() => handleDelete(sub.email)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
