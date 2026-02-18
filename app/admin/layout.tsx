import type { Metadata } from "next"
import AdminLayoutClient from "@/components/admin/admin-layout-client"

export const metadata: Metadata = {
  title: "Admin Dashboard | Angeli Visions",
  description: "Administration Panel",
}

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
