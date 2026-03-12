"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Trash2, Search, RefreshCw, User, FileText, Phone, CalendarDays } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Reclamation {
    id: string
    number: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    subject: string
    message: string
    createdAt: string
}

export default function ReclamationsManager() {
    const [reclamationsList, setReclamationsList] = useState<Reclamation[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null)

    useEffect(() => {
        fetchReclamations()
    }, [])

    const fetchReclamations = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/reclamations")
            if (res.ok) {
                const data = await res.json()
                setReclamationsList(data.reclamations || [])
            }
        } catch (error) {
            console.error("Error fetching reclamations:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette réclamation ?")) return
        try {
            const res = await fetch("/api/reclamations", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            if (res.ok) {
                setReclamationsList((prev) => prev.filter((d) => d.id !== id))
            }
        } catch (error) {
            console.error("Error deleting reclamation:", error)
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

    const filteredReclamations = reclamationsList.filter(
        (r) =>
            r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.number?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Réclamations</h2>
                    <p className="text-slate-400">Gérez les réclamations reçues ({reclamationsList.length})</p>
                </div>
                <Button onClick={fetchReclamations} variant="outline" className="border-slate-700 text-slate-300">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualiser
                </Button>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Rechercher par numéro, nom ou email..."
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
                                    <TableHead className="text-slate-400">N° Réclamation</TableHead>
                                    <TableHead className="text-slate-400">Date</TableHead>
                                    <TableHead className="text-slate-400">Client</TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            Chargement des réclamations...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredReclamations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            Aucune réclamation trouvée.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReclamations.map((rec) => (
                                        <TableRow key={rec.id} className="border-slate-700 hover:bg-white/5">
                                            <TableCell className="text-slate-300 font-medium">
                                                {rec.number}
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm whitespace-nowrap">
                                                {formatDate(rec.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-slate-200">
                                                <div className="font-medium">{rec.firstName} {rec.lastName}</div>
                                                <div className="text-xs text-slate-500">{rec.email}</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-white/40 hover:text-blue-400 hover:bg-blue-400/10 h-8 w-8 p-0"
                                                                onClick={() => setSelectedReclamation(rec)}
                                                            >
                                                                <FileText className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-xl flex items-center gap-2">
                                                                    <FileText className="w-5 h-5 text-purple-400" />
                                                                    Détails de la Réclamation {selectedReclamation?.number}
                                                                </DialogTitle>
                                                                <DialogDescription className="text-slate-400">
                                                                    Envoyée le {formatDate(String(selectedReclamation?.createdAt))}
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            {selectedReclamation && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                                                    <div className="space-y-4">
                                                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-400 border-b border-white/10 pb-1">Client</h4>
                                                                        <div className="space-y-2 text-sm">
                                                                            <p className="flex items-center gap-2 text-slate-200"><User className="w-4 h-4 text-slate-500" /> {selectedReclamation.firstName} {selectedReclamation.lastName}</p>
                                                                            <p className="flex items-center gap-2 text-slate-200"><Mail className="w-4 h-4 text-slate-500" /> {selectedReclamation.email}</p>
                                                                            {selectedReclamation.phone && <p className="flex items-center gap-2 text-slate-200"><Phone className="w-4 h-4 text-slate-500" /> {selectedReclamation.phone}</p>}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-span-full space-y-4">
                                                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-400 border-b border-white/10 pb-1">Message</h4>
                                                                        <div className="space-y-3">
                                                                            <div className="font-semibold text-slate-200">{selectedReclamation.subject}</div>
                                                                            <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-sm text-slate-300 whitespace-pre-wrap">
                                                                                {selectedReclamation.message}
                                                                            </div>
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
                                                        onClick={() => handleDelete(rec.id)}
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
