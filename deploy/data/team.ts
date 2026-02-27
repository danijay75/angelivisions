export type SocialLinks = Partial<{
  instagram: string
  linkedin: string
  twitter: string
  facebook: string
  website: string
}>

export type TeamMember = {
  id: string
  name: string
  title: string
  email: string
  photo: string
  roles?: string[] // tags/responsabilités
  socials?: SocialLinks
  order: number // for drag & drop ordering
}

export const defaultTeam: TeamMember[] = [
  {
    id: "t-1",
    name: "Camille Angeli",
    title: "Direction artistique",
    email: "camille@angelivisions.com",
    photo: "/placeholder.svg?height=320&width=480",
    roles: ["Programmation", "Direction"],
    socials: { instagram: "https://instagram.com/angelivisions", linkedin: "https://linkedin.com" },
    order: 0,
  },
  {
    id: "t-2",
    name: "Alex Martin",
    title: "Production",
    email: "alex@angelivisions.com",
    photo: "/placeholder.svg?height=320&width=480",
    roles: ["Production", "Logistique"],
    socials: { linkedin: "https://linkedin.com", website: "https://angelivisions.com" },
    order: 1,
  },
  {
    id: "t-3",
    name: "Sofia Ben",
    title: "Communication",
    email: "sofia@angelivisions.com",
    photo: "/placeholder.svg?height=320&width=480",
    roles: ["Social", "Presse"],
    socials: { twitter: "https://x.com", instagram: "https://instagram.com" },
    order: 2,
  },
]
