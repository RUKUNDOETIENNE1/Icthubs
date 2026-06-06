import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils/slugify'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default function NewPostPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">New post</h1>
      <form className="card p-6" action={createPost}>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input name="title" className="mt-1 w-full border rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Excerpt</label>
            <textarea name="excerpt" className="mt-1 w-full border rounded-md p-2" rows={3} />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" name="intent" value="draft">Save draft</button>
            <button className="btn" name="intent" value="publish">Publish</button>
          </div>
        </div>
      </form>
    </main>
  )
}

async function createPost(formData: FormData) {
  'use server'
  const title = String(formData.get('title') || '')
  const excerpt = String(formData.get('excerpt') || '')
  const intent = String(formData.get('intent') || 'draft')
  const slug = slugify(title)
  const status = intent === 'publish' ? 'PUBLISHED' : 'DRAFT'
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
    ?? (await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' }, select: { id: true } }))?.id
    ?? (await prisma.user.findFirst({ select: { id: true } }))!.id
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content: {},
      status,
      author: { connect: { id: userId } },
    },
    select: { id: true },
  })
  redirect(`/admin/posts/${post.id}`)
}
