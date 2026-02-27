"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Trash2, Search, RefreshCw, User, CalendarDays, FileText, Phone, Building, MapPin, Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Devis {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
    eventType: string
    services: string[]
    eventDate?: string
    guestCount?: string
    location?: string
    description?: string
    createdAt: string
}

export default function DevisManager() {
    const [devisList, setDevisList] = useState<Devis[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null)

    useEffect(() => {
        fetchDevis()
    }, [])

    const fetchDevis = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/devis")
            if (res.ok) {
                const data = await res.json()
                setDevisList(data.devis || [])
            }
        } catch (error) {
            console.error("Error fetching devis:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette demande de devis ?")) return
        try {
            const res = await fetch("/api/devis", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            if (res.ok) {
                setDevisList((prev) => prev.filter((d) => d.id !== id))
            }
        } catch (error) {
            console.error("Error deleting devis:", error)
        }
    }

    const formatDate = (dateStr: string): string => {
        if (!dateStr) return "—"
        try {
            return new Date(dateStr).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
        } catch {
            return "—"
        }
    }

    const filteredDevis = devisList.filter(
        (d) =>
            d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.company?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Gestion Devis</h2>
                    <p className="text-slate-400">Gérez les demandes de devis reçues ({devisList.length})</p>
                </div>
                <Button onClick={fetchDevis} variant="outline" className="border-slate-700 text-slate-300">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualiser
                </Button>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Rechercher par nom, email ou entreprise..."
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
                                    <TableHead className="text-slate-400">Date</TableHead>
                                    <TableHead className="text-slate-400">Client</TableHead>
                                    <TableHead className="text-slate-400">Événement</TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            Chargement des devis...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredDevis.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            Aucun devis trouvé.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDevis.map((devis) => (
                                        <TableRow key={devis.id} className="border-slate-700 hover:bg-white/5">
                                            <TableCell className="text-slate-400 text-sm whitespace-nowrap">
                                                {formatDate(devis.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-slate-200">
                                                <div className="font-medium">{devis.name}</div>
                                                <div className="text-xs text-slate-500">{devis.email}</div>
                                            </TableCell>
                                            <TableCell className="text-slate-300 text-sm">
                                                <div className="capitalize">{devis.eventType}</div>
                                                <div className="text-xs text-slate-500 italic">
                                                    {devis.services.join(", ")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-white/40 hover:text-blue-400 hover:bg-blue-400/10 h-8 w-8 p-0"
                                                                onClick={() => setSelectedDevis(devis)}
                                                            >
                                                                <FileText className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-xl flex items-center gap-2">
                                                                    <FileText className="w-5 h-5 text-purple-400" />
                                                                    Détails du Devis
                                                                </DialogTitle>
                                                                <DialogDescription className="text-slate-400">
                                                                    Soumis le {formatDate(String(selectedDevis?.createdAt))}
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            {selectedDevis && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                                                    <div className="space-y-4">
                                                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-400 border-b border-white/10 pb-1">Client</h4>
                                                                        <div className="space-y-2 text-sm">
                                                                            <p className="flex items-center gap-2 text-slate-200"><User className="w-4 h-4 text-slate-500" /> {selectedDevis.name}</p>
                                                                            <p className="flex items-center gap-2 text-slate-200"><Mail className="w-4 h-4 text-slate-500" /> {selectedDevis.email}</p>
                                                                            {selectedDevis.phone && <p className="flex items-center gap-2 text-slate-200"><Phone className="w-4 h-4 text-slate-500" /> {selectedDevis.phone}</p>}
                                                                            {selectedDevis.company && <p className="flex items-center gap-2 text-slate-200"><Building className="w-4 h-4 text-slate-500" /> {selectedDevis.company}</p>}
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-400 border-b border-white/10 pb-1">Événement</h4>
                                                                        <div className="space-y-2 text-sm">
                                                                            <p className="flex items-center gap-2 text-slate-200"><Users className="w-4 h-4 text-slate-500" /> {selectedDevis.eventType} ({selectedDevis.guestCount || "?"} pers.)</p>
                                                                            <p className="flex items-center gap-2 text-slate-200"><CalendarDays className="w-4 h-4 text-slate-500" /> {selectedDevis.eventDate || "Date non spécifiée"}</p>
                                                                            <p className="flex items-center gap-2 text-slate-200"><MapPin className="w-4 h-4 text-slate-500" /> {selectedDevis.location || "Lieu non spécifié"}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-span-full space-y-4">
                                                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-400 border-b border-white/10 pb-1">Services & Description</h4>
                                                                        <div className="space-y-3">
                                                                            <div className="flex flex-wrap gap-2 text-xs">
                                                                                {selectedDevis.services.map(s => (
                                                                                    <span key={s} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                                                                                        {s}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                            {selectedDevis.description && (
                                                                                <div className="bg-slate-800/50 p-3 rounded border border-slate-700 text-sm italic text-slate-300 whitespace-pre-wrap">
                                                                                    {selectedDevis.description}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-white/40 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                                                        onClick={() => handleDelete(devis.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
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
