"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  content: any
  onChange?: (json: any) => void | Promise<void>
  placeholder?: string
}

export function TiptapEditor({ content, onChange, placeholder }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const saveTimer = useRef<number | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: true,
      }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write something amazing…' }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: content ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[320px] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      if (!onChange) return
      setIsSaving(true)
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(async () => {
        await onChange(json)
        setIsSaving(false)
      }, 700) as unknown as number
    },
  })

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [])

  const addImage = async () => {
    const url = window.prompt('Paste image URL')
    if (!url) return
    editor?.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-white">
        <button className="text-sm px-2 py-1 hover:bg-slate-100 rounded" onClick={() => editor?.chain().focus().toggleBold().run()}><b>B</b></button>
        <button className="text-sm px-2 py-1 hover:bg-slate-100 rounded italic" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
        <button className="text-sm px-2 py-1 hover:bg-slate-100 rounded" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button className="text-sm px-2 py-1 hover:bg-slate-100 rounded" onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</button>
        <button className="text-sm px-2 py-1 hover:bg-slate-100 rounded" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button className="text-sm px-2 py-1 hover:bg-slate-100 rounded" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>❝</button>
        <button className="text-sm px-2 py-1 hover:bg-slate-100 rounded" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>—</button>
        <button className="text-sm px-2 py-1 hover:bg-slate-100 rounded" onClick={addImage}>Image</button>
        <div className="ml-auto text-xs text-slate-500">{isSaving ? 'Saving…' : 'Saved'}</div>
      </div>
      <div className="bg-white p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
