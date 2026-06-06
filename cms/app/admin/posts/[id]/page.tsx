import { prisma } from '@/lib/prisma'
import { TiptapEditor } from '@/components/editor/TiptapEditor'
import { redirect } from 'next/navigation'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) redirect('/admin/posts')

  return (
    <main>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit: {post.title}</h1>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <button className="btn" aria-label="Delete">Delete</button>
        </form>
      </div>

      <form className="card p-6 mb-6" action={updateMeta}>
        <input type="hidden" name="id" value={post.id} />
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input name="title" defaultValue={post.title} className="mt-1 w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Excerpt</label>
            <textarea name="excerpt" defaultValue={post.excerpt ?? ''} className="mt-1 w-full border rounded-md p-2" rows={3} />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" name="intent" value="save">Save</button>
            <button className="btn" name="intent" value="publish">Publish</button>
            <button className="btn" name="intent" value="unpublish">Unpublish</button>
          </div>
        </div>
      </form>

      <EditorClient id={post.id} content={post.content} />
    </main>
  )
}

function EditorClient({ id, content }: { id: string; content: any }) {
  async function onChange(json: any) {
    'use server'
    await prisma.post.update({ where: { id }, data: { content: json } })
  }

  return (
    <div className="card p-4">
      <TiptapEditor content={content} onChange={onChange} />
    </div>
  )
}

async function updateMeta(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  const title = String(formData.get('title') || '')
  const excerpt = String(formData.get('excerpt') || '')
  const intent = String(formData.get('intent') || 'save')
  await prisma.post.update({ where: { id }, data: { title, excerpt } })
  if (intent === 'publish') {
    await prisma.post.update({ where: { id }, data: { status: 'PUBLISHED', publishedAt: new Date() } })
  }
  if (intent === 'unpublish') {
    await prisma.post.update({ where: { id }, data: { status: 'UNPUBLISHED' } })
  }
}

async function deletePost(formData: FormData) {
  'use server'
  const id = String(formData.get('id'))
  await prisma.post.delete({ where: { id } })
  redirect('/admin/posts')
}
