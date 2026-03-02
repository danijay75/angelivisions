"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Link as LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-white bg-white/5 border border-white/10 rounded-b-md",
            },
        },
    })

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        if (url === null) {
            return
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-wrap gap-1 p-2 bg-slate-900 border border-white/10 border-b-0 rounded-t-md">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    icon={<Bold className="w-4 h-4" />}
                    title="Gras"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    icon={<Italic className="w-4 h-4" />}
                    title="Italique"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive("underline")}
                    icon={<UnderlineIcon className="w-4 h-4" />}
                    title="Souligné"
                />
                <div className="w-[1px] h-6 bg-white/10 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive("heading", { level: 1 })}
                    icon={<Heading1 className="w-4 h-4" />}
                    title="Titre 1"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive("heading", { level: 2 })}
                    icon={<Heading2 className="w-4 h-4" />}
                    title="Titre 2"
                />
                <div className="w-[1px] h-6 bg-white/10 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                    icon={<List className="w-4 h-4" />}
                    title="Liste à puces"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                    icon={<ListOrdered className="w-4 h-4" />}
                    title="Liste ordonnée"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                    icon={<Quote className="w-4 h-4" />}
                    title="Citation"
                />
                <div className="w-[1px] h-6 bg-white/10 mx-1 self-center" />
                <MenuButton
                    onClick={setLink}
                    active={editor.isActive("link")}
                    icon={<LinkIcon className="w-4 h-4" />}
                    title="Lien"
                />
                <div className="flex-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    icon={<Undo className="w-4 h-4" />}
                    title="Annuler"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    icon={<Redo className="w-4 h-4" />}
                    title="Rétablir"
                />
            </div>
            <EditorContent editor={editor} />
            <style jsx global>{`
        .prose-invert {
          --tw-prose-body: #fff;
          --tw-prose-headings: #fff;
          --tw-prose-links: #10b981;
          --tw-prose-bold: #fff;
          --tw-prose-counters: #fff;
          --tw-prose-bullets: #fff;
          --tw-prose-quotes: #fff;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .prose blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1rem;
          font-style: italic;
        }
      `}</style>
        </div>
    )
}

function MenuButton({ onClick, active, icon, title }: { onClick: () => void; active?: boolean; icon: React.ReactNode; title: string }) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                onClick()
            }}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${active ? "bg-emerald-600 text-white" : "text-white/60 hover:text-white"}`}
            title={title}
        >
            {icon}
        </button>
    )
}
