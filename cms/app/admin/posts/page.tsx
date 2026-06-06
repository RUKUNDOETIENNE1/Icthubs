import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function PostsPage({ searchParams }: { searchParams?: { q?: string; status?: string } }) {
  const where: any = {}
  if (searchParams?.q) where.title = { contains: searchParams.q, mode: 'insensitive' }
  if (searchParams?.status) where.status = searchParams.status

  const posts = await prisma.post.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, slug: true, status: true, updatedAt: true },
  })

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link className="btn btn-primary" href="/admin/posts/new">New post</Link>
      </div>
      <div className="card">
        <div className="p-4 border-b flex gap-2">
          <form className="flex gap-2 w-full">
            <input className="border rounded-md p-2 flex-1" name="q" placeholder="Search title..." defaultValue={searchParams?.q ?? ''} />
            <select name="status" className="border rounded-md p-2">
              <option value="">All</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="UNPUBLISHED">Unpublished</option>
            </select>
            <button className="btn" type="submit">Filter</button>
          </form>
        </div>
        <div className="divide-y">
          {posts.length === 0 && <div className="p-4 text-slate-500">No posts</div>}
          {posts.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-slate-500">/{p.slug} · {p.status} · {new Date(p.updatedAt).toLocaleString()}</div>
              </div>
              <Link className="text-brand-green text-sm" href={`/admin/posts/${p.id}`}>Edit →</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
