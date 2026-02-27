import type { Metadata } from "next"
import BlogIndexClient from "./BlogIndexClient"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

// Server Component: no `dynamic(..., { ssr: false })` here.
// Just render the client wrapper.
export default function BlogIndexPage() {
  return <BlogIndexClient />
}
