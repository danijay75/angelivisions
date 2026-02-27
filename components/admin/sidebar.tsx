"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
// Ensure Button is safely imported or use html button
import {
    Layers,
    FolderKanban,
    TrendingUp,
    Users as UsersIcon,
    Music4,
    Newspaper,
    Mail,
    UserCog,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    FileText,
    Mic2
} from "lucide-react"

export type AdminSection =
    | "services"
    | "projects"
    | "artists"
    | "investment"
    | "team"
    | "player"
    | "blog"
    | "newsletter"
    | "devis"
    | "users"

interface AdminSidebarProps {
    currentSection: string
    onSectionChange: (section: string) => void
}

export function AdminSidebar({ currentSection, onSectionChange }: AdminSidebarProps) {
    const { user, logout } = useAuth()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const menuItems = [
        { id: "services", label: "Services", icon: Layers },
        { id: "projects", label: "Projets", icon: FolderKanban },
        { id: "artists", label: "Artistes", icon: Mic2 },
        { id: "investment", label: "Investissement", icon: TrendingUp },
        { id: "team", label: "Équipe", icon: UsersIcon },
        { id: "player", label: "Lecteur Audio", icon: Music4 },
        { id: "blog", label: "Blog / Actu", icon: Newspaper },
        { id: "newsletter", label: "Newsletter", icon: Mail },
        { id: "devis", label: "Devis", icon: FileText },
        { id: "users", label: "Utilisateurs", icon: UserCog, adminOnly: true },
    ]

    const handleLogout = async () => {
        await logout()
        window.location.href = "/admin/login"
    }

    const NavContent = () => (
        <div className="flex flex-col h-full w-full bg-slate-950 text-white border-r border-white/10">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-purple-900/50">
                    AV
                </div>
                <div>
                    <h1 className="font-bold tracking-wider text-sm text-white">ANGELI VISIONS</h1>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Administration</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Gestion</p>
                {menuItems.map((item) => {
                    if (item.adminOnly && user?.role !== 'admin') return null

                    const isActive = currentSection === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onSectionChange(item.id)
                                setIsMobileOpen(false)
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left",
                                isActive
                                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", isActive ? "text-purple-400" : "text-white/40 group-hover:text-white")} />
                            {item.label}
                        </button>
                    )
                })}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/70 border border-white/10">
                        {String(user?.email || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{String(user?.email)}</p>
                        <p className="text-xs text-white/40 capitalize">{String(user?.role)}</p>
                    </div>
                </div>
                <button
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-md py-2 text-sm transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 h-screen sticky top-0 bg-slate-950 border-r border-white/10 shadow-2xl z-50">
                <NavContent />
            </div>

            {/* Mobile Topbar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 z-50 bg-slate-950 border-b border-white/10 px-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center font-bold text-white">AV</div>
                    <span className="font-bold text-white tracking-wider text-sm">ADMINISTRATION</span>
                </div>
                <button
                    className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
                    onClick={() => setIsMobileOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <div className="absolute top-0 bottom-0 left-0 w-72 bg-slate-950 shadow-2xl animate-in slide-in-from-left duration-200 border-r border-white/10">
                        <NavContent />
                        <button
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
