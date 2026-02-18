"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Edit, Eye, EyeOff, Plus, ShieldAlert, Trash2 } from "lucide-react"

type Role = "admin" | "editor" | "guest"

interface UserRow {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export default function UsersPage() {
  const router = useRouter()
  const { isAdmin, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [bootstrap, setBootstrap] = useState<boolean | null>(null)
  const [users, setUsers] = useState<UserRow[]>([])
  const [openCreate, setOpenCreate] = useState(false)
  const [openEditId, setOpenEditId] = useState<string | null>(null)
  const [showPasswordCreate, setShowPasswordCreate] = useState(false)

  // Load users and detect bootstrap mode (no users yet)
  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          setLoading(true)
          const res = await fetch("/api/admin/users", { cache: "no-store" })
          const data = (await res.json()) as UserRow[] | { error?: string }
          if (!cancelled) {
            if (Array.isArray(data)) {
              setUsers(data)
              setBootstrap(data.length === 0)
            } else {
              setBootstrap(false)
            }
          }
        } catch (e: any) {
          toast({ variant: "destructive", title: "Erreur", description: e?.message || "Chargement impossible" })
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()
    return () => {
      cancelled = true
    }
  }, [])

  // If not bootstrap and not admin (after auth is known), redirect back to /admin
  useEffect(() => {
    if (bootstrap === false && !authLoading && !isAdmin) {
      router.replace("/admin")
    }
  }, [bootstrap, authLoading, isAdmin, router])

  const editing = useMemo(() => users.find((u) => u.id === openEditId) || null, [users, openEditId])

  async function handleCreate(form: FormData) {
    const name = String(form.get("name") || "").trim()
    const email = String(form.get("email") || "")
      .trim()
      .toLowerCase()
    const role = (String(form.get("role") || "editor") as Role) || "editor"
    const password = String(form.get("password") || "")
    const active = String(form.get("active") || "true") === "true"

    if (!name || !email || !password) {
      toast({ variant: "destructive", title: "Champs requis", description: "Nom, email et mot de passe." })
      return
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: bootstrap ? "admin" : role,
          active,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Création impossible")
      setUsers((prev) => [data as UserRow, ...prev])
      if (bootstrap) setBootstrap(false)
      setOpenCreate(false)
      toast({ title: "Utilisateur créé", description: `${name}` })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur", description: e?.message || "Création impossible" })
    }
  }

  async function handleUpdate(id: string, patch: Partial<UserRow> & { password?: string }) {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Mise à jour impossible")
      setUsers((prev) => prev.map((u) => (u.id === id ? (data as UserRow) : u)))
      setOpenEditId(null)
      toast({ title: "Utilisateur mis à jour" })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur", description: e?.message || "Mise à jour impossible" })
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Suppression impossible")
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast({ title: "Utilisateur supprimé" })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur", description: e?.message || "Suppression impossible" })
    }
  }

  if (loading || bootstrap === null) {
    return <div className="text-sm text-muted-foreground">{"Chargement…"}</div>
  }

  return (
    <div className="space-y-6">
      {bootstrap && (
        <div className="flex items-center gap-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900">
          <ShieldAlert className="h-4 w-4" />
          <p className="text-sm">
            {
              "Mode initial: accès ouvert. Créez le premier compte administrateur. La section redeviendra protégée ensuite."
            }
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{"Gestion des utilisateurs"}</h1>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {"Nouvel utilisateur"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{bootstrap ? "Créer l’administrateur" : "Créer un utilisateur"}</DialogTitle>
            </DialogHeader>
            <form
              action={(formData) => {
                handleCreate(formData)
              }}
              className="grid gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="name">{"Nom"}</Label>
                <Input id="name" name="name" placeholder="Nom complet" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{"Email"}</Label>
                <Input id="email" name="email" type="email" placeholder="email@domaine.com" required />
              </div>

              {bootstrap ? (
                <div className="grid gap-1">
                  <Label>{"Rôle"}</Label>
                  <Badge className="w-fit uppercase">{"admin"}</Badge>
                  <input type="hidden" name="role" value="admin" />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="role">{"Rôle"}</Label>
                  {/* shadcn Select is not a native field — keep a hidden input to submit the value */}
                  <input id="role-hidden" type="hidden" name="role" defaultValue="editor" />
                  <Select
                    defaultValue="editor"
                    onValueChange={(v) => {
                      const input = document.getElementById("role-hidden") as HTMLInputElement | null
                      if (input) input.value = v
                    }}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{"Administrateur"}</SelectItem>
                      <SelectItem value="editor">{"Éditeur"}</SelectItem>
                      <SelectItem value="guest">{"Invité"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="password">{"Mot de passe"}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPasswordCreate ? "text" : "password"}
                    placeholder="Mot de passe"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordCreate((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showPasswordCreate ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    title={showPasswordCreate ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPasswordCreate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active" className="flex-1">
                  {"Compte actif"}
                </Label>
                <input type="hidden" name="active" value="true" />
                <Switch
                  defaultChecked
                  onCheckedChange={(ch) => {
                    const input = document.querySelector<HTMLInputElement>('input[name="active"]')
                    if (input) input.value = ch ? "true" : "false"
                  }}
                  id="active"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenCreate(false)}>
                  {"Annuler"}
                </Button>
                <Button type="submit">{bootstrap ? "Créer l’admin" : "Créer"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{"Comptes"}</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <Table>
              <TableCaption>{"Aucun utilisateur pour le moment."}</TableCaption>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{"Nom"}</TableHead>
                  <TableHead>{"Email"}</TableHead>
                  <TableHead>{"Rôle"}</TableHead>
                  <TableHead>{"Actif"}</TableHead>
                  <TableHead className="text-right">{"Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell className="font-mono text-xs">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase">
                        {String(u.role || "")}
                      </Badge>
                    </TableCell>
                    <TableCell>{u.active ? "Oui" : "Non"}</TableCell>
                    <TableCell className="text-right">
                      <Dialog open={openEditId === u.id} onOpenChange={(o) => setOpenEditId(o ? u.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Modifier">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{"Modifier l’utilisateur"}</DialogTitle>
                          </DialogHeader>
                          <EditUserForm
                            user={u}
                            onCancel={() => setOpenEditId(null)}
                            onSave={async (patch) => {
                              await handleUpdate(u.id, patch)
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EditUserForm({
  user,
  onCancel,
  onSave,
}: {
  user: UserRow
  onCancel: () => void
  onSave: (patch: Partial<UserRow> & { password?: string }) => Promise<void>
}) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<Role>(user.role)
  const [active, setActive] = useState<boolean>(user.active)
  const [password, setPassword] = useState("")

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const patch: Partial<UserRow> & { password?: string } = { name, email, role, active }
        if (password) patch.password = password
        await onSave(patch)
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="name-edit">{"Nom"}</Label>
        <Input id="name-edit" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email-edit">{"Email"}</Label>
        <Input id="email-edit" type="email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role-edit">{"Rôle"}</Label>
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger id="role-edit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">{"Administrateur"}</SelectItem>
            <SelectItem value="editor">{"Éditeur"}</SelectItem>
            <SelectItem value="guest">{"Invité"}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password-edit">{"Nouveau mot de passe (optionnel)"}</Label>
        <Input id="password-edit" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="active-edit">{"Compte actif"}</Label>
        <Switch id="active-edit" checked={active} onCheckedChange={setActive} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {"Annuler"}
        </Button>
        <Button type="submit">{"Enregistrer"}</Button>
      </div>
    </form>
  )
}
