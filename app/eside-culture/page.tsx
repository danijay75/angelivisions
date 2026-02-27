import { redirect } from "next/navigation"

export default function OldBlogIndexRedirect() {
  redirect("/eside-culture-blog")
  return null
}
