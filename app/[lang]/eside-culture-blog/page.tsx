import BlogIndexClient from "./BlogIndexClient"

// Server Component: no `dynamic(..., { ssr: false })` here.
// Just render the client wrapper.
export default function BlogIndexPage() {
  return <BlogIndexClient />
}
