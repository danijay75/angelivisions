export function sanitizeHtml(html: string): string {
    if (typeof window === "undefined") {
        // Server-side: basic tag stripping (not perfect, but better than nothing for now)
        return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
            .replace(/on\w+="[^"]*"/g, "")
            .replace(/javascript:/g, "")
    }

    // Client-side: use DOM parser
    try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")

        // Remove scripts
        const scripts = doc.querySelectorAll("script")
        scripts.forEach(script => script.remove())

        // Remove event handlers from all elements
        const allElements = doc.querySelectorAll("*")
        allElements.forEach(el => {
            const attributes = el.attributes
            for (let i = attributes.length - 1; i >= 0; i--) {
                const name = attributes[i].name
                if (name.startsWith("on") || attributes[i].value.includes("javascript:")) {
                    el.removeAttribute(name)
                }
            }
        })

        return doc.body.innerHTML
    } catch (e) {
        console.error("Sanitization error", e)
        return html // Fallback
    }
}
