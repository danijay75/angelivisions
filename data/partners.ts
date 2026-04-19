export type Partner = {
  id: string
  name: string
  logo: string
  url: string
  order: number
}

export const defaultPartners: Partner[] = [
  {
    id: "p-1",
    name: "Maison de Disque Exemple",
    logo: "/placeholder.svg?height=100&width=200",
    url: "https://example.com",
    order: 0,
  },
  {
    id: "p-2",
    name: "Label Partenaire",
    logo: "/placeholder.svg?height=100&width=200",
    url: "https://example.com",
    order: 1,
  }
]
